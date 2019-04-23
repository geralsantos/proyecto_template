var liga_unir = {
    template: '#liga-unir',
    data:()=>({

        nombre_equipo:null,
        nombre_liga:null,
        codigo:null,
        bloque_codigo:false,
        bloque_liga:false,
        loader:false,

    }),
    created:function(){
    },
    mounted:function(){
        this.cargar_liga();
    },
    updated:function(){

    },
    methods:{

        guardar(){


              let equipo = {"nombre":this.nombre_equipo};
              let liga = {"codigo":this.codigo, "estado": 3};
                this.loader=true;
              this.$http.post('unirse_liga?view',{ equipo:equipo, liga:liga}).then(function(response){
                this.loader=false;

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
                        text: response.body.mensaje,
                        icon: "error",
                        buttons: false,
                        dangerMode: false,
                      });
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                  }

              });
        },
        cargar_liga(){
            this.bloque_liga=false;
            this.nombre_equipo=null;
            this.nombre_liga=null;
            this.codigo=null;
            this.$http.post('mostrar_formulario_unir_liga?view',{}).then(function(response){
                if( response.body.resultado ){

                    this.bloque_liga = response.body.form;
                    if(!response.body.form){
                        this.bloque_codigo=true;
                        this.nombre_liga = response.body.nombre_liga;
                    }

                }


              });
        }

    }
  }