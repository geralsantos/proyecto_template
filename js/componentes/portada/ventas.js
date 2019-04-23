var ventas ={
    template: '#ventas',
    data:()=>({

        datos_liga:[],
        jugadores:[],
        contador_ventas:0,
        mostrar:false,
        mensaje:null,
        loader:false,

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
                    if(this.datos_liga.eliminado==0){
                        if(this.datos_liga.temporada_estado == 3 || this.datos_liga.temporada_estado == 5 ){
                            this.cargar_jugadores_ventas();

                          }else{
                              this.mostrar= false;
                              this.mensaje = "No estas en período de ventas."
                          }
                    }else{
                        this.mensaje = "Tu equipo ha sido eliminado."
                        this.mostrar= false;
                    }


                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });

        },
        cargar_jugadores_ventas(){
            this.$http.post('cargar_jugadores_ventas?view',{liga_participantes: this.datos_liga.liga_participantes_id, temporada_liga_id:this.datos_liga.temporada_id}).then(function(response){
                if( response.body.resultado ){
                    this.jugadores = response.body.data;
                    this.contador_ventas = response.body.contador_ventas;

                    if(this.contador_ventas==5 && this.datos_liga.temporada_estado == 3 || this.contador_ventas==5 && this.datos_liga.temporada_estado == 5){
                        this.mensaje = "Haz realizado todas tus ventas";
                        this.mostrar= false;
                    }else{
                        this.mostrar = true;
                    }
                }
            });
        },

        vender(jugador){
            if(this.contador_ventas>=5){
                swal("Venta no permitida","No puedes realizar mas de 5 ventas" , "warning");
                return false;
            }

            let nuevo_saldo = parseFloat(this.datos_liga.saldo_disponible) + parseFloat(jugador.valor_venta);
            swal({
                title: "",
                text: "¿Estas seguro de querer vender al jugador: "+ jugador.nombre+ "?",
                icon: "warning",
                buttons: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                    let equipo = {id:this.datos_liga.id,
                                    jugadores:this.datos_liga.jugadores }
                    this.loader = true;
                    this.$http.post('vender_mercado?view',{jugador: jugador, liga_participantes: this.datos_liga.liga_participantes_id, temporada_liga: this.datos_liga.temporada_id, equipo: equipo, liga_id: this.datos_liga.liga_id, nuevo_saldo:nuevo_saldo }).then(function(response){
                        this.loader = false;
                        if( response.body.resultado ){

                            swal({
                                title: "",
                                text: "Venta realizada",
                                icon: "success",
                                buttons: false,
                                dangerMode: false,
                              })
                              setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);

                        }else{

                            swal({
                                title: "",
                                text: response.body.mensaje,
                                icon: "error",
                                buttons: false,
                                dangerMode: false,
                              })
                              setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);
                        }
                    });
                }
            });

        }
    }
  }