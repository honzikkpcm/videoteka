(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
	'use strict';

	return {
		generate: function (componentGen, def, componentWrapperTree, isDesigntime) {
		    var processBinding = componentGen.processBinding,
		        editorValueTree,
		        params = [],
		        editor = componentGen.editor;

		    if (isDesigntime) {
		    	editorValueTree = new componentGen.Tree('input');
		    	editorValueTree.attributes.type = 'text';
		    } else {
		    	editorValueTree = new componentGen.Tree('sffw-tariclookup');

				if (def.Data && def.Data.Binding) {
			    	params.push('data: ' + processBinding(def.Data.Binding, null));
			    }

			    if (def.DataApiObject) {
					params.push('dataApiObject: ' + (def.DataApiObject.IsGlobal ? '$root.$globals.$api[\'' : '$root.$api[\'') + def.DataApiObject.Reference + '\']');
			    }

			    if (def.DisplayMember) {
		    		params.push('displayMember: \'' + def.DisplayMember + '\'');
	    		}

				if (def.PanelClass) {
			    	params.push('panelClass: \'' + def.PanelClass + '\'');
				}

			    if (def.MinChars) {
			    	params.push('minChars: ' + def.MinChars);
			    }

		        var enabled = def.IsEnabled || def.IsEnabled === undefined;
		        if (enabled && enabled.Binding) {
		            params.push('isEnabled: ' + processBinding(def.IsEnabled.Binding));
		        } else if (!enabled) {
		        	params.push('isEnabled: false');
		        }

				if (def.expectLinebreaksInValues === true) {
					params.push('expectLinebreaksInValues: true');
				}

			    if (def.enabledMember) {
                    params.push('enabledMember: '
							+ (def.enabledMember.Binding
								? processBinding(def.enabledMember.Binding)
								: '\'' + def.enabledMember.replace(/\"/g, '&quot;') + '\''));
	    		}

			    if (def.staticODataFilter) {
                    params.push('staticODataFilter: '
							+ (def.staticODataFilter.Binding
								? processBinding(def.staticODataFilter.Binding)
								: '\'' + def.staticODataFilter.replace(/\"/g, '&quot;') + '\''));
	    		}

				params.push('$parentData: $data');
				params.push('$localizeFn: $root.$localize');

			    if (params.length > 0) {
			    	editorValueTree.attributes.params = params.join(', ');
				}
			}

		    editor.generate(componentGen, def, componentWrapperTree, isDesigntime, editorValueTree);
		}
	};
});