var equipos_plantilla = {
    template: '#equipos-plantilla',
    data:()=>({
        nombre_equipo:null,
        equipo:[],
        jugadores:[],
        plantilla :[],


    }),
    created:function(){
    },
    mounted:function(){
        this.cargar();
    },
    updated:function(){

    },
    methods:{

        cargar(){
            let id = document.getElementById("mensaje_entre_componentes").value;
            console.log(id)
            this.equipo = [];
            let tabla = 'equipos';
            let where = {id:id, estado:1};
            let campos = '*';
            this.$http.post('cargar_datos?view',{tabla:tabla,where:where,campos:campos}).then(function(response){

                if( response.body.resultado ){
                    console.log(response.body.data)
                    this.equipo= response.body.data;
                    this.nombre_equipo =  response.body.data.nombre;
                    this.jugadores = JSON.parse(this.equipo.jugadores);
                    console.log(response.body.data.teams_id)
                    if(response.body.data.teams_id==null){
                        swal("Error","Tienes que seleccionar tu plantilla", "error");
                    }else{
                        this.ver_platilla();
                    }
                }else{
                    swal("Error", "Un error ha ocurrido", "error");
                }
                this.remover_mensaje_entre_componentes();
            });
        },
        ver_platilla(){
            this.equipo_vista=2;
            this.$http.post('cargar_plantilla_2?view',{jugadores:this.jugadores}).then(function(response){
                if( response.body.resultado ){
                   this.plantilla = response.body.plantilla;

                }
            });
        },
        remover_mensaje_entre_componentes(){
            var input = document.getElementById("mensaje_entre_componentes");
            input.parentNode.removeChild(input)
        },


    }
  }