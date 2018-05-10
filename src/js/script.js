var numSocket = new D3NE.Socket("number", "Number value", "hint");
var strSocket = new D3NE.Socket('string', 'String', 'hint');

var componentTop = new D3NE.Component("Top", {
    builder(node) {
       var out1 = new D3NE.Output("Position Top (max 160)", numSocket);
       var numControl = new D3NE.Control('<input type="number">',
          (el, c) => {
             el.value = c.getData('num') || 80;
          
             function upd() {
                c.putData("num", parseFloat(el.value));
             }
 
             el.addEventListener("input", ()=>{
                upd();
                editor.eventListener.trigger("change");
             });
             el.addEventListener("mousedown", function(e){e.stopPropagation()});// prevent node movement when selecting text in the input field
            upd();
          }
       );
 
       return node.addControl(numControl).addOutput(out1);
    },
    worker(node, inputs, outputs) {
       outputs[0] = node.data.num;
    }
 });


var componentLeft = new D3NE.Component("Left", {
    builder(node) {
       var out1 = new D3NE.Output("Position Left (max 420)", numSocket);
       var numControl = new D3NE.Control('<input type="number">',
          (el, c) => {
             el.value = c.getData('num') || 210;
          
             function upd() {
                c.putData("num", parseFloat(el.value));
             }
 
             el.addEventListener("input", ()=>{
                upd();
                editor.eventListener.trigger("change");
             });
             el.addEventListener("mousedown", function(e){e.stopPropagation()});// prevent node movement when selecting text in the input field
            upd();
          }
       );
 
       return node.addControl(numControl).addOutput(out1);
    },
    worker(node, inputs, outputs) {
       outputs[0] = node.data.num;
    }
 });

 var componentColor = new D3NE.Component("Color", {
    builder(node) {
       var out1 = new D3NE.Output("Color", strSocket);
       var colorControl = new D3NE.Control('<input type="color">',
          (el, c) => {
             el.value = c.getData('color') || '#00d2ff';
          
             function upd() {
                 c.putData("color", el.value);
             }
 
             el.addEventListener("input", ()=>{
                upd();
                editor.eventListener.trigger("change");
             });
             el.addEventListener("mousedown", function(e){e.stopPropagation()});// prevent node movement when selecting text in the input field
            upd();
          }
       );
 
       return node.addControl(colorControl).addOutput(out1);
    },
    worker(node, inputs, outputs) {
       outputs[0] = node.data.color;
    }
 });


var componentButton = new D3NE.Component("Button", {
   builder(node) {
      var inp1 = new D3NE.Input("Position Top", numSocket);
      var inp2 = new D3NE.Input("Position Left", numSocket);
      var inp3 = new D3NE.Input("Color", strSocket);

      var numControl1 = new D3NE.Control(
         '<input readonly type="number">',
         (el, control) => {
            control.setValue = val => {
               el.value = val;
            };
         }
      );

      var numControl2 = new D3NE.Control(
        '<input readonly type="number">',
        (el, control) => {
           control.setValue = val => {
              el.value = val;
           };
        }
     );

     var colorControl = new D3NE.Control(
        '<input readonly type="color">',
        (el, control) => {
           control.setValue = val => {
              el.value = val;
           };
        }
     );

      return node
         .addInput(inp1)
         .addInput(inp2)
         .addInput(inp3)
         .addControl(numControl1)
         .addControl(numControl2)
         .addControl(colorControl)
   },
   worker(node, inputs, outputs) {
        var myButton = document.getElementById('my-button');
        //TOP
        if(inputs[0][0]<= 160 && inputs[0][0]>=0) {
            myButton.style.top = inputs[0][0]+'px';
        } else if(inputs[0][0] > 160) {
            myButton.style.top = '160px';
        } else {
            myButton.style.top = '0px';
        }

        //LEFT
        if(inputs[1][0]<= 420 && inputs[1][0]>=0) {
            myButton.style.left = inputs[1][0]+'px';
        } else if(inputs[1][0] > 420) {
            myButton.style.left = '420px';
        } else {
            myButton.style.left = '0px';
        }
        
        //COLOR
        myButton.style.backgroundColor = inputs[2][0] + '';

        editor.nodes.find(n => n.id == node.id).controls[0].setValue(inputs[0][0]);
        editor.nodes.find(n => n.id == node.id).controls[1].setValue(inputs[1][0]);
        editor.nodes.find(n => n.id == node.id).controls[2].setValue(inputs[2][0]);
   }
});

var menu = new D3NE.ContextMenu({
   Values: {
      Value: componentTop,
      Action: function() {
         alert("ok");
      }
   },
   Button: componentButton
});

var container = document.getElementById("nodeEditor");
var components = [componentTop, componentLeft, componentColor, componentButton];
var editor = new D3NE.NodeEditor("demo@0.1.0", container, components, menu);

var n1 = componentTop.builder(componentTop.newNode());
var n2 = componentLeft.builder(componentLeft.newNode());
var n3 = componentColor.builder(componentColor.newNode());
var button = componentButton.builder(componentButton.newNode());

n1.position = [40, 50];
n2.position = [40, 250];
n3.position = [40, 450];
button.position = [400, 130];

editor.connect(n1.outputs[0], button.inputs[0]);
editor.connect(n2.outputs[0], button.inputs[1]);
editor.connect(n3.outputs[0], button.inputs[2]);

editor.addNode(n1);
editor.addNode(n2);
editor.addNode(n3);
editor.addNode(button);
//  editor.selectNode(tnode);

var engine = new D3NE.Engine("demo@0.1.0", components);

editor.eventListener.on("change", async function() {
   await engine.abort();
   await engine.process(editor.toJSON());
});

editor.view.zoomAt(editor.nodes);
editor.eventListener.trigger("change");
editor.view.resize();

