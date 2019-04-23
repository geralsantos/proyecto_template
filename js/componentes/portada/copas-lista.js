var copas_lista =  {
    template: '#copas-lista',
    data:()=>({
      portada:true,
      copas : [],
      copa_datos:[],
      partidos_copa : [],
      completa:true,
      mostrar:false,
      mensaje:null,
      mostrar_grafico:false,

      equipos:[],

      copa:[],
      datos_grafico:[],

      branch:[],
    }),
    created:function(){
    },
    mounted:function(){
      this.cargar_datos_usuario();

    },
    updated:function(){

    },
    methods:{
      cargar_datos_usuario(){

        this.$http.post('cargar_datos_usuario?view',{}).then(function(response){
            if( response.body.resultado ){
              this.datos_liga = response.body.data;
              if(this.datos_liga.temporada_estado){
                  if(this.datos_liga.temporada_estado==2){
                    this.mensaje = "Todavía no inicia la temporada"
                    this.mostrar= false;
                  }else{

                    this.cargar_copas();
                  }
              }else{
                this.mensaje = "Todavía no inicia la temporada"
                this.mostrar= false;
              }
                console.log(this.datos_liga);
            }else{
                this.mensaje = "No perteneces a ninguna liga"
                this.mostrar= false;
            }
        });

    },
    regresar(){
        console.log("REGRESAR")
        this.mostrar_grafico=false;
    },
      cargar_copas(){
        this.$http.post('cargar_copas?view',{}).then(function(response){
            if( response.body.resultado ){
                this.mostrar= true;
               this.copas= response.body.copas;
               console.log(this.copas[0].estado)
               for(var i= 0; i <  this.copas.length; i++) {
                this.copas[i].fecha_creacion = moment(this.copas[i].fecha_creacion).format('DD-MM-YYYY');
            }
               console.log(this.copas);
            }else{
                this.mensaje = "Todavía no se registran los partidos"
                this.mostrar= false;
            }
        });
    },

    cargar_equipos(copa){
        this.datos_grafico=[];
        this.equipos=[];
        this.branch=[];
      this.copa_datos = copa;
      this.$http.post('cargar_equipos_copa_grafico?view',{datos_liga:this.datos_liga, temporada_liga_id:copa.temporada_liga_id}).then(function(response){
          if( response.body.resultado ){

            console.log(response.body.data);
            this.mostrar_grafico=true;
            this.equipos = response.body.data;
            let buildTree = this.buildTree(response.body.data);
            let buildTreeHtml = this.buildTreeHtml(buildTree);

             this.datos_grafico = this.branch;
       /*   this.datos_grafico = [
            { id: 1, parentId: null, name: "Equipo 1",  title: "CEO", salary: "$10000",  image: "../images/equipo.jpg" },
            { id: 2, parentId: 1, name: "Equipo 2", title: "CEO", salary: "$5000", image: "../images/equipo.jpg" },
            { id: 3, parentId: 1, name: "Equipo 3", title: "CEO", salary: "$8000", image: "../images/equipo.jpg" },
            { id: 4, parentId: 2, name: "Equipo 4", title: "CEO", salary: "$9000", image: "../images/../images/equipo.jpg" },
            { id: 5, parentId: 2, name: "Equipo 5", title: "CEO", salary: "$3000", image: "../images/equipo.jpg" },
            { id: 6, parentId: 3, name: "Equipo 6",  title: "CEO",salary: "$4000", image: "../images/equipo.jpg" },
            { id: 7, parentId: 3, name: "Equipo 7 : 5 goles",  title: "Equipo 6 : 3 goles",salary: "sfasfas", image: "../images/equipo.jpg" }
           ]; */
        this.iniciar();
      //  this.mostrar=true;


          }else{
              this.mensaje = "Todavía no se ha registrado la copa";
              this.mostrar=false;
          }
      });
  },
  iniciar(){
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    var hex2rgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };

    var rgb2hex = function (rgb) {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    };

    var interpolateColor = function (color1, color2, factor) {
        if (arguments.length < 3) { factor = 0.5; }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    var source =this.datos_grafico;

    console.log(source)

    var start = hex2rgb("#008000");
    var end = hex2rgb("#cc3300");
    var max = null;
    var min = null;
    var factor = null;

    function setFactor(chart) {
        max = null;
        min = null;
        for (var id in chart.nodes) {
            var node = chart.nodes[id];
            if (node.data["salary"]) {
                var salary = node.data["salary"].replace("$", "");
                if (isNumeric(salary)) {
                    if (max == null && min == null) {
                        max = salary;
                        min = salary;
                    }
                    else {
                        max = Math.max(salary, max);
                        min = Math.min(salary, min);
                    }
                }
            }
        }
        factor = (max - min) / 100;
    }

    var peopleElement = document.getElementById("people");
    function renderNodeEventHandler(sender, args) {
        var salary = args.node.data["salary"].replace("$", "");
        if (!isNumeric(salary)) {
            return;
        }

        if (!factor) {
            setFactor(sender);
        }

        var val = (salary - min) / factor;
        var rgb = interpolateColor(start, end, val / 100);
        var hex = rgb2hex(rgb);
        args.content[1] = args.content[1].replace("rect", "rect style='fill: " + hex + "; stroke: " + hex + ";'")
    }
    setTimeout(() => {
        var orgChart = new getOrgChart(document.getElementById("people"), {
            primaryFields: ["salary", "name", "title"],
            photoFields: ["image"],
            enableZoom: false,
            enableEdit: false,
            enableDetailsView: false,
            dataSource: source,
            renderNodeEvent: renderNodeEventHandler
        });

    }, 1000);



},
buildTree(elements, parentId = null) {
    let branch = [];
    for (let index = 0; index < elements.length; index++) {

        if (elements[index]['cod_proximo_partido'] == parentId) {

            let children = this.buildTree(elements, elements[index]['code']);
            if (children) {
                elements[index]['children'] = children;
            }
            branch.push(elements[index]);
        }
    }
  return branch;
},
buildTreeHtml(elements,opt="")
{
    let branch =[];
    let li = '';
    for (let index = 0; index < elements.length; index++) {
        if (!isempty(elements[index]['children'])) {
            let buildTreeHtml = this.buildTreeHtml(elements[index]['children'],'childs');
        }
        this.branch.push({ id: elements[index]['code'], parentId: elements[index]['cod_proximo_partido'],title: (elements[index]['datos_local'] ), name: (elements[index]['datos_visitante'] ),
        salary: (elements[index]['estado_partido'] ), image: (elements[index]['imagen'] ) });
    }
    return branch;
}

    }
  }