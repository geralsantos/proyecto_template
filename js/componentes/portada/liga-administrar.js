var liga_administrar= {
    template: '#liga-administrar',
    data:()=>({

        liga:null,

        kickoff_hora:null,
        datos_liga:[],
        nombre_liga:null,
        nro_participantes:null,
        participantes_registrados:null,
        kickoff_fecha:null,
        mensaje: '',
       boton_actualizar:false,
       loader:false,
        readonly_on:false,

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
                    console.log(this.datos_liga)
                    this.nombre_liga = this.datos_liga.nombre_liga;
                    this.liga = this.datos_liga.liga_id;
                    this.nro_participantes = this.datos_liga.nro_participantes;
                    this.participantes_registrados = response.body.participantes_registrados;
                    this.kickoff_fecha= moment(this.datos_liga.fecha_kickoff).format("DD-MM-YYYY");

                    if(this.datos_liga.estado_liga==1){
                        this.boton_actualizar = false;
                        this.readonly_on=true;

                    }else{
                        this.boton_actualizar = true;
                    }
                }
            });
        },

        actualizar_datos(){
            let tabla = 'liga';
            let where = {id:this.liga};

            if( parseInt(this.participantes_registrados) > parseInt(this.nro_participantes)){
                swal("Error", "El número de participantes registrados no puede ser mayor al número de participantes de la liga", "warning");
                return false;
            }
            let campos = {nombre:this.nombre_liga,nro_participantes:this.nro_participantes };
            this.loader = true;
            this.$http.post('actualizar_datos?view',{tabla:tabla,where:where,campos:campos}).then(function(response){
                this.loader = false;
                if( response.body.resultado ){
                    swal({
                        title: " ",
                        text: response.body.mensaje,
                        icon: "success",
                        buttons: false,
                        dangerMode: false,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);

                }else{
                    swal({
                        title: " ",
                        text: "Ha ocurrido un error. Intente de nuevo",
                        icon: "error",
                        buttons: false,
                        dangerMode: true,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                }
            });

        },
        iniciar_periodo_subastas(){
            this.loader = true;
            this.$http.post('iniciar_periodo_subastas?view',{datos_liga:this.datos_liga}).then(function(response){
                this.loader = false;
                if( response.body.resultado ){

                    swal({
                        title: " ",
                        text: response.body.mensaje,
                        icon: "success",
                        buttons: false,
                        dangerMode: false,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);


                }else{
                    swal({
                        title: " ",
                        text: "Ha ocurrido un error. Intente de nuevo",
                        icon: "error",
                        buttons: false,
                        dangerMode: true,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                }

            });
        },
        generar_partidos_liga(){
            this.loader = true;
            this.$http.post('generar_partidos_liga?view',{liga:this.liga, temporada_liga_id: this.datos_liga.temporada_id}).then(function(response){

                this.loader = false;
                if( response.body.resultado ){

                    swal({
                        title: " ",
                        text: "Partidos generados exitosamente",
                        icon: "success",
                        buttons: false,
                        dangerMode: false,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);

                }else{
                    swal({
                        title: " ",
                        text: "Ha ocurrido un error. Intente de nuevo",
                        icon: "error",
                        buttons: false,
                        dangerMode: true,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                }
            });
        },
        finalizar_temporada(){
            this.loader = true;
            this.$http.post('finalizar_temporada?view',{datos_liga:this.datos_liga}).then(function(response){
                this.loader = false;
                if( response.body.resultado ){
                    swal({
                        title: " ",
                        text: response.body.mensaje,
                        icon: "success",
                        buttons: false,
                        dangerMode: false,
                      });
                      if(response.body.finalizada){

                        setTimeout(() => {
                            window.location.hash='#portada-index';
                            window.location.reload(true);
                        }, 3000);

                      }else{
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 3000);
                      }


                }else{
                    swal({
                        title: " ",
                        text: "Ha ocurrido un error. Intente de nuevo",
                        icon: "error",
                        buttons: false,
                        dangerMode: true,
                      });
                  /*     setTimeout(() => {
                        window.location.reload(true);
                    }, 3000); */
                }
            });
        }


    }
  }