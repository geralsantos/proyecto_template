var equipos_administrar = {
    template: '#equipos-administrar',
    data:()=>({
        equipos:[],
        equipo:[],

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
                    if(this.datos_liga.temporada_partidos_generados==0){
                        this.mostrar=true;
                    this.cargar_equipos_liga();
                    }else{
                        console.log(this.datos_liga)
                        if(this.temporada_id==null){
                            this.mensaje = "No se pueden eliminar equipos en la primera temporada";
                        }else{
                            this.mensaje = "Solo se puede eliminar equipos antes de generar los partidos. Esperar a la siguiente temporada para eliminar al equipo antes de generar los partidos.";
                        }

                        this.mostrar=false;
                    }
                }else{

                    this.mensaje = "No perteneces a ninguna liga";
                    this.mostrar=false;
                }
            });
        },
        cargar_equipos_liga(){
            this.$http.post('cargar_equipos_liga?view',{datos_liga:this.datos_liga}).then(function(response){
                console.log(response.body)
                if( response.body.resultado ){

                    this.equipos= response.body.data;
                    for(var i= 0; i <  this.equipos.length; i++) {

                        if(this.equipos[i].id==this.datos_liga.equipo_id){
                            this.equipos.splice(i,1);
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
                    this.mensaje = "Equipos no registrados";
                    this.mostrar=false;
                }
            });
        },




      eliminar(equipo){
        swal({
            title: "",
            text: "¿Está seguro de querer eliminar al equipo "+equipo.nombre+"?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.loader = true;
                this.$http.post('eliminar_equipo?view',{equipo:equipo}).then(function(response){
                    this.loader = false;
                    if( response.body.resultado ){
                        swal({
                            title: " ",
                            text:"Equipo eliminado",
                            icon: "success",
                            buttons: false,
                            dangerMode: false,
                          })
                          setTimeout(() => {
                            window.location.reload(true);
                        }, 3000);
                    }else{
                        swal({
                            title: " ",
                            text:"Un error ha ocurrido. Intente de nuevo.",
                            icon: "error",
                            buttons: false,
                            dangerMode: true,
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