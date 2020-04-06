(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils", "./editor"], factory);
    }
})(function (require, exports) {
    'use strict';
    
    return {
    	generate: function (componentGen, def, componentWrapperTree, isDesigntime) {
	        var processBindingPreferAsString = componentGen.processBindingPreferAsString,
	        	processActionReference = componentGen.processActionReference,
	        	Tree = componentGen.Tree,
	        	editorValueTree;			

            if (isDesigntime) {
				editorValueTree = new Tree('div');
				editorValueTree.content.push({ text: '{výběr souboru}' });
            } else {
            	var paramsParts = [];
				editorValueTree = new Tree('sffw-file-reader');
					
		        if (def.TextAlign) {
		            editorValueTree.style['text-align'] = def.TextAlign.toLowerCase();
				}
            
				if (def.FileContent && def.FileContent.Binding) {
					paramsParts.push('FileContent: ' + processBindingPreferAsString(def.FileContent.Binding));
				}			
            
				if (def.FileName && def.FileName.Binding) {
	                paramsParts.push('FileName: ' + processBindingPreferAsString(def.FileName.Binding));
	            }
				
				if (def.FileType && def.FileType.Binding) {
	                paramsParts.push('FileType: ' + processBindingPreferAsString(def.FileType.Binding));
	            }
	            
				if (def.Filter) {
					if (def.Filter.Binding) {
						paramsParts.push('Filter: ' + processBindingPreferAsString(def.Filter.Binding));
					} else {
						paramsParts.push('Filter: \'' + def.Filter + '\'');
					}
	            }
	            	            
	            if (def.IsEnabled) {
	            	if (def.IsEnabled.Binding) {
	            	    paramsParts.push('IsEnabled: ' + componentGen.processBinding(def.IsEnabled.Binding));
	            	} else {
	            		paramsParts.push('IsEnabled: ' + def.IsEnabled);
	            	}
	            }
            
            	if (def.OnChange) {
            		paramsParts.push('OnChange: ' + processActionReference(def.OnChange));
            	}
            	editorValueTree.attributes.params = paramsParts.join(', ');
            }

	        componentGen.editor.generate(componentGen, def, componentWrapperTree, isDesigntime, editorValueTree);
	    }
    };
});
