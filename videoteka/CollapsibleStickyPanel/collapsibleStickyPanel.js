var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var collapsibleStickyPanel;
        (function (collapsibleStickyPanel) {
            var CollapsibleStickyPanelModel = /** @class */ (function () {
                function CollapsibleStickyPanelModel(params, componentInfo) {
                    var _this = this;
                    this.collapsedIcClass = ko.observable('fa fa-caret-up');
                    this.nonCollapsedIcClass = ko.observable('fa fa-caret-down');
                    this.cssClass = ko.observable('sffw-csp csp-default');
                    this.animate = false;
                    this.animateDuration = 600;
                    this.caption = params.caption;
                    if (params.markerText) {
                        this.markerText = params.markerText;
                    }
                    if (params.markerCss) {
                        this.markerCss = params.markerCss;
                    }
                    this.collapseActionHandler = params.OnCollapseClick;
                    if (_.isUndefined(params.isVisible)) {
                        this.isVisible = ko.observable(false);
                    }
                    else {
                        this.isVisible = params.isVisible;
                    }
                    if (typeof params.collapsedIconClass !== 'undefined' && params.collapsedIconClass !== null && params.collapsedIconClass !== '') {
                        this.collapsedIcClass(params.collapsedIconClass);
                    }
                    if (typeof params.nonCollapsedIconClass !== 'undefined' && params.nonCollapsedIconClass !== null && params.nonCollapsedIconClass !== '') {
                        this.nonCollapsedIcClass(params.nonCollapsedIconClass);
                    }
                    if (params.cssClass && params.cssClass.length > 0) {
                        this.cssClass(params.cssClass);
                    }
                    if (params.animate === true) {
                        this.animate = true;
                    }
                    if (params.animateDuration != null && typeof (params.animateDuration) !== 'undefined' && params.animateDuration >= 0) {
                        this.animateDuration = params.animateDuration;
                    }
                    this.isExpanded = params.isExpanded || ko.observable(false);
                    this.ctx = params.$parentData;
                    this.onToggleCollapseClick = this.toggleCollapse;
                    this.markerCssValue = ko.pureComputed(function () {
                        if (_this.markerCss && ko.unwrap(_this.markerCss)) {
                            return 'sffw-csp-marker sffw-csp-marker-' + ko.unwrap(_this.markerCss);
                        }
                        return null;
                    });
                    this.markerTextValue = ko.pureComputed(function () {
                        return _this.markerText && ko.unwrap(_this.markerText);
                    });
                }
                CollapsibleStickyPanelModel.prototype.toggleCollapse = function (data, event) {
                    data.isExpanded(!data.isExpanded());
                    if (this.collapseActionHandler) {
                        this.collapseActionHandler();
                    }
                };
                return CollapsibleStickyPanelModel;
            }());
            collapsibleStickyPanel.CollapsibleStickyPanelModel = CollapsibleStickyPanelModel;
        })(collapsibleStickyPanel = components.collapsibleStickyPanel || (components.collapsibleStickyPanel = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var collapsibleStickyPanel;
        (function (collapsibleStickyPanel) {
            if (ko && !ko.components.isRegistered('sffw-collapsible-sticky-panel')) {
                ko.components.register('sffw-collapsible-sticky-panel', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.collapsibleStickyPanel.CollapsibleStickyPanelModel(params, componentInfo); }
                    },
                    template: "\n            <div data-bind=\"visible: isVisible, css: cssClass\">\n                <ul>\n                    <li role=\"presentation\">\n                        <a role=\"button\" data-bind=\"clickBubble: false,\n                            event: { click: function(model, event) {\n                                event = event || window.event;\n                                var elem = event.target || event.srcElement;\n                                if (animate === true) {\n                                    if (typeof jQuery.ui !== 'undefined') {\n                                        if ($data.isExpanded()) {\n                                            $(elem).parent().parent().next().hide(animateDuration);\n                                            setTimeout(function(){ $data.onToggleCollapseClick($data, event); }, animateDuration)\n                                        } else {\n                                            $(elem).parent().parent().next().show(animateDuration);\n                                            $data.onToggleCollapseClick($data, event);\n                                        }\n                                    } else {\n                                        $data.onToggleCollapseClick($data, event);\n                                        console.error('Missing jQueryUI library - check jQueryUI package');\n                                    }\n                                } else {\n                                    $data.onToggleCollapseClick($data, event);\n                                }\n                            }}\">\n                            <span data-bind=\"text: caption\"></span>\n                            <span data-bind=\"css: !isExpanded() ? collapsedIcClass : nonCollapsedIcClass\"></span>\n                            <!-- ko if: markerTextValue --><span class=\"sffw-csp-marker-text\" data-bind=\"text: markerTextValue\"></span><!-- /ko -->\n                            <!-- ko if: markerCssValue --><span data-bind=\"css: markerCssValue\"></span><!-- /ko -->\n                        </a>\n                    </li>\n                </ul>\n                <div data-bind=\"visible: isExpanded\">\n                    <!-- ko template: { nodes: $componentTemplateNodes, data: ctx } --><!-- /ko -->\n                </div>\n            </div>"
                });
            }
        })(collapsibleStickyPanel = components.collapsibleStickyPanel || (components.collapsibleStickyPanel = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
