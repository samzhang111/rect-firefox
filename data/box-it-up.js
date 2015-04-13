(function (){
    // Pane box
    var box = document.createElement('div'),
        dims = {},
        panes = {
            // top-left, top-right, ...
            tl: document.createElement('div'),  
            tr: document.createElement('div'),  
            bl: document.createElement('div'),  
            br: document.createElement('div'),  
        },
        panes_key = {
            "tl": "1",
            "tr": "2",
            "bl": "3",
            "br": "4"
        },
        // Reverse of pane_keys --> generated below
        keys_pane = {},
        // Stores name of active pane
        active_pane,
        ctrl = false;
    

    // Generating keys_pane from pane_keys
    for (var p in panes_key) {
        keys_pane[panes_key[p]] = p;
    }

    initPaneBox();
    
    window.onresize = initPaneBox;
    window.onkeyup = keyup;
    window.onkeydown = keydown;

    document.body.appendChild(box);
    box.appendChild(panes.tl);
    box.appendChild(panes.tr);
    box.appendChild(panes.br);
    box.appendChild(panes.bl);
    // Split screen into several panes
    

    function keydown (e) {
        // Check application state. Is it in ctrl mode?
        if (ctrl === true) {
            // Set active pane if it is a number key
            if (e.key in keys_pane) {
                console.log("Setting active pane:", e.key);
                setActivePane(e.key);
            }
        }

        // Activate ctrl mode
        else if (e.ctrlKey === true) {
            ctrl = true;
            // Show panes
            showPanes();
        }

        // If neither, let go
    }

    function keyup (e) {
        // Release ctrl state and hide pane
        if (e.key == 'Control') {
            ctrl = false;
            hidePanes();
        }
    }
    
    // Event listener for keypress: switch active pane
    function setActivePane(key) {
        active_pane = keys_pane[key];
        removeAllHighlights();

        // Highlight elements inside active pane
        highlightElementsInPane(active_pane);
    }
    
    function removeAllHighlights() {
        return;
    }

    function highlightElementsInPane(pane) {
        elements = getAllElementsInBox(panes[pane].getBoundingClientRect());
        console.log("Highlight all elements in pane:", elements);
    }

    function getAllElementsInRect(rect) {
        // Loop through all elements on page, looking for elements
        // that appear partly in the rectangle.
        var valid_elements = [],
            client_box,
            elem;

        for (var i in document.all) {
            elem = document.all[i];
            if (!isSelectable(elem)) {
                continue;
            }

            client_box = elem.getBoundingClientRect();

            if (overlaps(client_box, rect)) {
                valid_elements.push(elem);
            }
        }

        return valid_elements;
    }
    
    function overlaps(a, b) {
        // these conditions make it impossible for two rectangles to overlap
        if (a.bottom < b.top ||
            b.bottom < a.top ||
            a.left > b.right ||
            b.left > a.right ) return false;

        return true;
    }
    function isSelectable(elem) {
        return (elem.style.visibility == "visible" &&
            elem.tabIndex >= 0 &&
            elem.tagName in ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON']
            );
    }

    function resetActivePane() {
        // What should this do?
        active_pane = "";
    }

    // Draw borders around items in active pane
    function showBorders(pane) {
        // remove active pane emphasis
        // add emphasis on active pane
    }
    
    // Hide borders in pane
    function hideBorders(pane) {
    }

    // Initialize a pane box
    function initPaneBox(e) {
        // Starting dimensions
        dims = {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight,
            t: 0,
            l: 0,
        };
        
        setPaneBox(dims);
        setPanes(dims);
    }
    // Set dimensions of a pane box
    function setPaneBox(dims) {
        var default_pane_style = getDefaultPaneStyles();    
        
        _elemSetStyle(box, default_pane_style);
        box.style.borders = "5px dotted";
        box.style.left = dims.l + "px";
        box.style.top = dims.t + "px";
        box.style.height = dims.h + "px";
        box.style.width = dims.w + "px";
    }
    // Size the panes based off pane box dimensions
    function setPanes(dims) {
        var default_pane_style = getDefaultPaneStyles();    

        _elemSetStyle(panes.tl, default_pane_style);
        panes.tl.style.left = dims.l + 1 + "px";
        panes.tl.style.top = dims.t + 1 + "px";
        panes.tl.innerHTML = panes_key.tl;

        _elemSetStyle(panes.tr, default_pane_style);
        panes.tr.style.left = dims.l + dims.w/2 + "px";
        panes.tr.style.top = dims.t + 1 + "px";
        panes.tr.innerHTML = panes_key.tr;
        
        _elemSetStyle(panes.bl, default_pane_style);
        panes.bl.style.left = dims.l + 1 + "px";
        panes.bl.style.top = dims.t + dims.h/2 + "px";
        panes.bl.innerHTML = panes_key.bl;
        
        _elemSetStyle(panes.br, default_pane_style);
        panes.br.style.left = dims.l + dims.w/2 + "px";
        panes.br.style.top = dims.t + dims.h/2 + "px";
        panes.br.innerHTML = panes_key.br;
    }
    
    function _elemSetStyle(elem, styles) {
        for (var s in styles) {
            elem.style[s] = styles[s];
        }
    }
    
    function getDefaultPaneStyles() {
        return {
            position : "absolute",
            border : "1px solid",
            "z-index" : 1000,
            visibility : "hidden",
            "border-radius": 0,
            "pointer-events": "none",
            width: dims.w/2-1 + "px",
            height: dims.h/2-1 + "px",
            "background-color": "transparent",
            margin: 0,
            padding: 0,
            float: "auto",
            display: "inline-block",
            "vertical-align": "middle",
            "text-align": "center",
            "font-size": "32px"
        };
    }
    
    
    // Show panes
    function showPanes() {
        for (var pane in panes){
            panes[pane].style.visibility = 'visible';
        }
    }

    // Hide panes
    function hidePanes() {
        for (var pane in panes){
            panes[pane].style.visibility = 'hidden';
        }
    }
})();
