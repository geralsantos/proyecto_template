var liga_plantilla_otros_equipos = {
    template: '#liga-plantilla-otros-equipos',
    data:()=>({
        nombre_equipo:null,
        equipo:[],
        jugadores:[],
        plantilla :[],
        equipos:[],
        plantilla:[],
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
                    if(this.datos_liga.temporada_estado){
                        this.cargar_equipos();
                        this.mostrar= true;
                    }else{
                        this.mensaje = "Todavía no inicia la temporada";
                        this.mostrar= false;
                    }
                    console.log(this.datos_liga);
                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });

        },
        cargar_equipos(){
            /* this.$http.post('cargar_equipos?view',{}).then(function(response){
                if( response.body.resultado ){
                    this.equipos= response.body.equipos;
                    console.log( this.equipos)
                    for(var i= 0; i <  this.equipos.length; i++) {
                        let jugadores = JSON.parse(this.equipos[i].jugadores);
                    let num =(jugadores.length != undefined)?jugadores.length:0;
                    this.equipos[i].jugadores_num =num;
                    }

                }else{

                }
            }); */
            let where = {liga_id:this.datos_liga.liga_id }
            this.$http.post('cargar_datos_all?view',{tabla:'equipos',where:where, orderby:'nombre'}).then(function(response){
                this.equipos= response.body.data;
                for (let i = 0; i < this.equipos.length; i++) {
                    if(this.equipos[i].eliminado==1){
                        this.equipos.splice(i,1);
                    }
                    if(this.equipos[i].id==this.datos_liga.equipo_id){
                        this.equipos.splice(i,1);
                    }
                }
            });

        },


        cargar_equipo(){
            let id = this.equipo.id;
            let tabla = 'equipos';
            let where = {id:id, estado:1};
            let campos = '*';
            this.$http.post('cargar_datos?view',{tabla:tabla,where:where,campos:campos}).then(function(response){

                if( response.body.resultado ){
                    this.jugadores = JSON.parse(this.equipo.jugadores);
                    console.log(response.body.data.teams_id)
                    if(response.body.data.teams_id==null){
                        swal("Error","El equipo no tiene la plantilla completa.", "error");
                    }else{
                        this.ver_platilla();
                    }
                }else{
                    swal("Error", "Un error ha ocurrido", "error");
                }

            });
        },
        ver_platilla(){

            this.$http.post('cargar_plantilla_2?view',{jugadores:this.jugadores}).then(function(response){
                if( response.body.resultado ){
                   this.plantilla = response.body.plantilla;

                }
            });
        },

    }
  }