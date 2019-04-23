var solicitudes = {
    template: '#solicitudes',
    data:()=>({
        equipos:[],
        equipo:[],
        jugadores:[],
        plantilla :[],
        nombre_equipo:null,
        datos_liga:[],
        mostrar:false,
        mensaje:null,
        loader:false
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
                        if(this.datos_liga.temporada_estado==3){

                            this.cargar_solicitudes_compra();
                        }else{
                            this.mensaje = "No estas en período de negociaciones";
                            this.mostrar=false;
                        }
                    }else{
                        this.mensaje = "Tu equipo ha sido eliminado."
                        this.mostrar= false;
                    }

                }else{
                    this.mensaje = "No perteneces a ninguna liga";
                    this.mostrar=false;
                }
            });
        },
        cargar_solicitudes_compra(){

            this.$http.post('cargar_solicitudes_compra?view',{datos_liga:this.datos_liga}).then(function(response){

                if( response.body.resultado ){
                    this.mostrar=true;
                    this.solicitudes= response.body.data;
                }else{
                    this.mensaje = "No tienes solicitudes de compra";
                    this.mostrar=false;
                }
            });
        },
        rechazar(solicitud){

            swal({
                title: "",
                text: "¿Está seguro de querer rechazar esta venta?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    this.loader = true;
                    this.$http.post('cancelar_venta?view',{solicitud:solicitud}).then(function(response){
                        this.loader = false;
                        if( response.body.resultado ){
                            swal({
                                title: "",
                                text: "Venta rechazada",
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
                                text: "Ha ocurrido un error. Intente de nuevo",
                                icon: "error",
                                buttons: false,
                                dangerMode: true,
                              })
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);
                        }
                    });
                } else {
                  return false;
                }
              });
        },
        vender(solicitud){
            swal({
                title: "",
                text: "¿Está seguro de querer aceptar esta venta?",
                icon: "warning",
                buttons: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                    let new_array = JSON.parse(solicitud.solicitante_jugadores_plantilla);
                    new_array.push(solicitud.jugadores_id);
                    new_array = JSON.stringify(new_array);
                    this.loader = true;
                    this.$http.post('vender_otro_jugador?view',{solicitud:solicitud, datos_liga:this.datos_liga, nuevo_equipo:new_array}).then(function(response){
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
                                text: "Ha ocurrido un error. Intente de nuevo",
                                icon: "error",
                                buttons: false,
                                dangerMode: true,
                            })
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 3000);
                        }
                    });
                } else {
                  return false;
                }
              });



        }






    }
  }