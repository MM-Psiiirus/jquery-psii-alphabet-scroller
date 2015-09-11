;
(function ($) {

    $.fn.alphabetScroller = function (options) {

        var _self = this;

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            class: ".a-item",
            scrollIntervalCheck: 150,
            alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
            listContainerTemplate: '<div class="alphabetScroller_container"></div>',
            listGroupContainerTemplate: '<div class="alphabetScroller_container_group"></div>',
            listGroupHeadlineTemplate: '<div class="alphabetScroller_container_group_headline"></div>',
            alphabetSidebarTemplate: '<div class="alphabetScroller_sidebar_navi"></div>',

            onAfterRenderAlphabetSidebar: function () {
            },
            onAfterRenderList: function () {
            },

            onBeforeRenderAlphabetSidebar: function () {
            },
            onBeforeRenderList: function () {
            },

            onAfterRender: function (_listContainer, _sidebar) {
            },
            onBeforeRender: function (_container) {
            },

        }, options);

        // do the scroll
        function _scrollToElement(_listDOM, y) {
            _listDOM.find('.alphabetScroller_sidebar_navi > div').each(function () {
                if (!( y <= $(this).offset().top || y >= $(this).offset().top + $(this).outerHeight() )) {

                    var target = $(this),
                        letter = target.attr('class');

                    var _group = _listDOM.find('.alphabetScroller_container_group.group-' + letter);
                    if (_group.length > 0) {
                        var position = _group.offset();

                        target.addClass('active').siblings().removeClass('active prev_active next_active');
                        _group.addClass('active').siblings().removeClass('active');

                        target.prev().addClass('prev_active');
                        target.next().addClass('next_active');

                        // scroll the page
                        $('body').scrollTop(position.top);

                    }

                }
            });
        }

        /**
         * set up a scroll event-listner
         */
        function _checkIfListIsOnTop(_listDOM) {
            var did_scroll = false,
                $window = $(window),
                distance = _listDOM.offset().top - 50; // The default position of the navbar

            $window.scroll(function (event) {
                did_scroll = true;
            });

            setInterval(function () {
                if (did_scroll) {
                    did_scroll = false;

                    if ($window.scrollTop() >= distance) {
                        _listDOM.addClass('sidebar-fixed-right');
                    }
                    else {
                        _listDOM.removeClass('sidebar-fixed-right');
                    }

                }
            }, settings.scrollIntervalCheck);

        }

        /**
         * creates the touchable navigation sidebar
         */
        function _renderAlphabetSidebar(_listDOM, _groupedItems) {
            settings.onBeforeRenderAlphabetSidebar();

            _checkIfListIsOnTop(_listDOM);

            //create sidebar out of the given template
            var _sidebar = $(settings.alphabetSidebarTemplate);

            //loop though the letters
            for (var i in _groupedItems) {
                _sidebar.append('<div class="' + i + '">' + i + '</div>');
            }

            //_sidebar.on('touchmove','div',[_listDOM],_onLetterTouch);
            _sidebar.on('touchend', function () {
                //drop az-scroller highlighting
                _listDOM.find('.alphabetScroller_sidebar_navi > div').removeClass('active prev_active next_active');

            });


            // bind touch event to scrollbar (for touch devices)
            $(_sidebar).bind('touchmove', function (event) {
                event.preventDefault();
                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                // scroll to divider position
                _scrollToElement(_listDOM, touch.pageY);
            });

            // bind mouse events to scrollbar (for desktop browsers)
            $(_sidebar).bind('mousedown', function () {
                $('.page').bind('mousemove', function (event) {
                    // prevent text selection while scrolling
                    $(this).css({
                        "-webkit-user-select": "none",
                        "-moz-user-select": "none",
                        "-ms-user-select": "none",
                        "user-select": "none"
                    });
                    // scroll to divider position
                    _scrollToElement(_listDOM, event.pageY);
                });

                // return page to normal functioning after mouseup
                $('.page').bind('mouseup', function () {
                    // release mousemove event control
                    $('.page').unbind('mousemove');
                    // return text selection to default
                    $(this).css({
                        "-webkit-user-select": "text",
                        "-moz-user-select": "text",
                        "-ms-user-select": "text",
                        "user-select": "text"
                    });
                });
            });


            settings.onAfterRenderAlphabetSidebar();

            //add sidebar to the alphabet dom
            _listDOM.append(_sidebar);
            _sidebar.css('margin-top', '-' + (_sidebar.height() / 2) + "px");
        }

        /**
         * renders the grouped list layout
         */
        function _renderList(_parentDOM, _groupedItems) {
            settings.onBeforeRenderList();

            //create container out of the given template
            var _container = $(settings.listContainerTemplate);

            //create groups and append them to the container
            for (var i in _groupedItems) {
                var _group = $(settings.listGroupContainerTemplate);
                _group.addClass('group-' + i);

                var _headline = $(settings.listGroupHeadlineTemplate).html(i);
                _headline.append('<a name="' + i + '"></a>');

                _group.append(_headline);

                for (var x in _groupedItems[i]) {
                    _group.append(_groupedItems[i][x]);
                }

                _container.append(_group);

            }

            _parentDOM.append(_container);

            settings.onAfterRenderList();

            return _container;
        }


        /**
         * boot up the plugin
         */
        return this.each(function () {

            var _container = $(this);

            var _groupedItems = {};

            //call back before start rendering
            settings.onBeforeRender(_container);

            //collect entrys
            $(this).find(settings.class).each(function () {

                var _item = this;
                var _text = $(_item).text().trim();
                var _letter = _text[0].toUpperCase();

                if ($.inArray(_letter.toLowerCase(), settings.alphabet) == -1)
                    _letter = '123'

                if (typeof _groupedItems[_letter] == "undefined")
                    _groupedItems[_letter] = [];

                _groupedItems[_letter].push(this);

            });


            var _listContainer = _renderList(_container, _groupedItems);
            var _sidebar = _renderAlphabetSidebar(_listContainer, _groupedItems);

            //call back after everthing is done
            settings.onAfterRender(_listContainer, _sidebar);

            return this;
        });
    };

}(jQuery));