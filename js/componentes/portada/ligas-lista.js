var ligas_lista = {
    template: '#ligas-lista',
    data:()=>({

      ligas : [],
      mostrar:false,
      mensaje:null,
      datos_liga:[]

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
                this.cargar_ligas_admin();
                this.mostrar= true;

            }else{
                this.mensaje = "No perteneces a ninguna liga"
                this.mostrar= false;
            }
        });

    },
    cargar_ligas_admin(){
        this.$http.post('cargar_ligas_all?view',{}).then(function(response){
          console.log(response.body)
            if( response.body.resultado ){
               this.ligas= response.body.data;
               console.log(this.ligas);

            }else{
              //swal("Error", "No hay ligas registradas o ligas con todos sus equipos regitsrados", "error");
            }
        });
      },
      /* tabla_clasificacion(liga_id){
        this.$http.post('ver_tabla_clasificacion?view',{liga:liga_id}).then(function(response){
          if( response.body.resultado ){
            this.portada = false;
          }else{
            swal("Error", "Ha ocurrido un error", "error");
          }
        });
      }, */
      ver_tabla(id_liga){

          this.mensaje_entre_componentes(id_liga);
          window.location.hash='#liga-tabla-clasificacion';

      },
      mensaje_entre_componentes(id_liga){
          var input = document.createElement("input");
          input.type = "hidden";
          input.id = "mensaje_entre_componentes";
          input.value = id_liga;
          document.body.appendChild(input);
        }

    }
  }