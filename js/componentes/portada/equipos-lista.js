var equipos_lista = {
    template: '#equipos-lista',
    data:()=>({
        equipos:[],
        equipo:[],
        jugadores:[],
        plantilla :[],
        nombre_equipo:null,
        datos_liga:[],
        mostrar:false,
        mensaje:null
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
                    console.log(this.datos_liga);
                    this.mostrar=true;
                    this.cargar_equipos();
                }else{

                    this.mensaje = "No perteneces a ninguna liga";
                    this.mostrar=false;
                }
            });
        },
        cargar_equipos(){
            this.$http.post('cargar_equipos?view',{}).then(function(response){
                console.log(response.body)
                if( response.body.resultado ){

                    this.equipos= response.body.equipos;
                    console.log(this.equipos)
                    for(var i= 0; i <  this.equipos.length; i++) {

                        if(this.equipos[i].eliminado==1){
                            this.equipos[i].estado_equipo="Eliminado";
                        }

                        if(this.equipos[i].jugadores){
                            let jugadores = JSON.parse(this.equipos[i].jugadores);
                            let num =(jugadores.length != undefined)?jugadores.length:0;
                            this.equipos[i].jugadores_num =num;
                        }else{
                            this.equipos[i].jugadores_num =0;
                        }

                    }

                }else{
                //swal("Error", "Un error ha ocurrido", "danger");
                }
            });
        },


        mensaje_entre_componentes_1(){
            var input = document.createElement("input");
            input.type = "hidden";
            input.id = "mensaje_entre_componentes";
            input.value = this.equipo.id;
            document.body.appendChild(input);
        },
        mensaje_entre_componentes_2(){
            var input = document.createElement("input");
            input.type = "hidden";
            input.id = "mensaje_entre_componentes";
            input.value = this.equipo.id;
            document.body.appendChild(input);
        },


        cargar_equipo(id, tipo){

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

                if(tipo=='plantilla'){
                    if(response.body.data.teams_id==null){
                        swal("Plantilla incompleta","Tienes que seleccionar tu plantilla en kickoff", "error");
                    }else{
                        this.mensaje_entre_componentes_1();
                        window.location.hash='#equipos-plantilla';
                    }
                }else{

                    if(response.body.data.teams_id==null){
                        this.mensaje_entre_componentes_2();
                        window.location.hash='#equipos-configuracion';
                    }else{
                        swal("Kickoff completado","No puedes cambiar la configuración de tu equipo", "error");
                    }

                }

                }else{
                swal("Error", "Un error ha ocurrido", "error");
                }
            });
        }



    }
  }