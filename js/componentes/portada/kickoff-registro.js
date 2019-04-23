var kickoff_registro= {
    template: '#kickoff-registro',
    data:()=>({
        ligas:[],

        liga:null,
        mostrar_solo_admin:false,
        kickoff_hora:null,
        nombre_liga:null,
        nro_participantes:null,
        participantes_registrados:null,
        kickoff_fecha:null,
        mensaje: '',
        loader:false,
        mostrar:false,

    }),
    created:function(){
    },
    mounted:function(){
        this.cargar_id_equipo();
    },
    updated:function(){

    },
    methods:{
        cargar_id_equipo(){

            this.$http.post('cargar_id_equipo?view',{}).then(function(response){

                if( response.body.resultado ){
                        if(response.body.equipos_cantidad==response.body.liga.nro_participantes){
                            this.liga=response.body.liga_id;
                            this.mostrar_liga();
                        }else{
                            this.mensaje = "Faltan equipos para generar el kickoff";
                            this.mostrar= false;
                        }
                }else{
                   this.mensaje = "No perteneces a ninguna liga";
                   this.mostrar= false;
                }

            });
        },
        cargar_ligas_admin(){

            this.$http.post('cargar_ligas_kickoff?view',{}).then(function(response){
                console.log(response.body.resultado)
                if( response.body.resultado ){

                    this.mostrar_solo_admin=true;
                   this.ligas= response.body.ligas;
                }else{

                   swal("Error", "Ninguna liga para kickoff", "warning");
                }
            });
        },
        mostrar_liga(){

            this.$http.post('mostrar_liga?view',{id:this.liga}).then(function(response){
                if( response.body.resultado ){

                    this.nombre_liga = response.body.liga["nombre"];
                    this.liga = response.body.liga["id"];
                    this.nro_participantes = response.body.liga["nro_participantes"];
                    this.participantes_registrados = response.body.participantes;
                    console.log(response.body.liga)

                    if(this.nro_participantes== this.participantes_registrados){
                        if(response.body.liga["kickoff_fecha"] != null){
                            this.mostrar=false;
                            if(response.body.liga["estado"]==1){
                                this.mensaje='Proceso de kickoff completo';
                            }else{
                                this.mensaje='Sorteo Generado. Ver Lista de Kickoff';
                            }


                        }else{
                            this.mostrar=true;
                        }

                    }else{
                        this.mensaje = 'Participantes Incompletos. Todavía no puede registrar el kickoff';
                    }
                }else{
                  swal("Error", "Un error ha ocurrido", "error");
                }
            });
        },

        generar_kickoff(){

            if(this.kickoff_fecha==null || this.kickoff_hora==null){
                swal("Error", "Debe introducir la fecha y hora de inicio del kickoff", "warning");
                return false;
            }

            if(this.kickoff_fecha < moment().format("YYYY-MM-DD")){
                swal("Error", "La fecha no puede ser menor a la fecha actual", "warning");
                return false;
            }

            let valores = {liga:this.liga, fecha:this.kickoff_fecha, hora:this.kickoff_hora}
            this.loader=true;
            this.$http.post('kickoff_sorteo?view',{valores:valores}).then(function(response){
                this.loader=false;
                if( response.body.resultado ){
                    swal({
                        title: "",
                        text:response.body.mensaje,
                        icon: "success",
                        buttons: false,
                        dangerMode: false,
                      });
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);

                }else{
                    swal({
                        title: "",
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



    }
  }