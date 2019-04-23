var liga_crear =  {
    template: '#liga-crear',
    data:()=>({
        nombre_liga:null,
        nombre_equipo:null,
        nro_participantes:null,
        codigo:null,
        bloque_codigo:false,
        bloque_liga:false,
        main_loader:false,
        rowsmodulos:[],
        loader:false


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

              let insert_liga = {"nombre":this.nombre_liga, "nro_participantes":this.nro_participantes};
              let insert_equipo = {"nombre":this.nombre_equipo};
              this.loader=true;
              this.$http.post('crear_liga?view',{tabla:'liga',insert_liga:insert_liga, insert_equipo:insert_equipo}).then(function(response){
                this.loader=false;
                if( response.body.resultado ){

                    swal({
                        title: " ",
                        text:"La liga se ha creado exitosamente",
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
        },
        cargar_liga(){

            this.$http.post('mostrar_formulario_crear_liga?view',{}).then(function(response){
                if( response.body.resultado ){
                    this.bloque_liga = response.body.crear;
                    if(!response.body.crear){
                        this.bloque_codigo=true;
                        this.codigo = response.body.codigo;
                    }
                }
            });
        }
    }
  }