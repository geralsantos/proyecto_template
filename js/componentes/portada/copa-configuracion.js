var copa_configuracion ={
    template: '#copa-configuracion',
    data:()=>({
        nombre_copa:null,
        equipo:[],
        mostrar:false,
        mensaje:null,
        datos_liga:[],

        avatar:'default.jpg'

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
                    if(this.datos_liga.temporada_estado!=null){
                        if(this.datos_liga.temporada_estado>3 || this.datos_liga.temporada_estado==0){

                            this.mensaje = "Ya no puedes cambiar la configuración de tu equipo";
                            this.mostrar=false;
                         }else{
                             this.cargar_copa()
                         }
                    }else{
                        this.mensaje = "No hay copa registrada";
                        this.mostrar=false;
                    }


                }else{
                    this.mensaje = "No perteneces a ninguna liga";
                    this.mostrar=false;
                }
            });
        },


        cargar_copa(){
            this.copa = [];
            let tabla = 'copa';
            let where = {temporada_liga_id:this.datos_liga.temporada_id};
            let campos = '*';
            this.$http.post('cargar_datos?view',{tabla:tabla,where:where,campos:campos}).then(function(response){
                if( response.body.resultado ){
                    this.mostrar=true;
                    console.log(response.body.data)
                    this.copa= response.body.data;
                  // this.avatar = response.body.data.avatar;
                    this.nombre_copa =  response.body.data.nombre;
                }else{
                    this.mensaje = "Todavía no se ha registrado la copa";
                    this.mostrar=false;
                }
            });
        },
        /* guardar(){

            let campos = {nombre:this.nombre_equipo};
            let where = {id:this.equipo.id, estado:1};
            this.$http.post('actualizar_datos?view',{tabla:'equipos', campos:campos, where:where}).then(function(response){
                if( response.body.resultado ){
                    swal("Equipo Actualizado","", "success");
                }else{
                    swal("Error","Ha ocurrido un error", "error");
                }
            });
        }, */
        guardar(){

            if(this.nombre_copa==''){
                swal("", "La copa tiene que tener un nombre", "warning");
                return false;
            }

            let campos={nombre:this.nombre_copa};

            let where = {id:this.copa.id};

            this.$http.post('actualizar_datos?view',{tabla:'copa', campos:campos, where:where }).then(function(response){

                if (response.body.resultado) {

                    swal({
                        title: "",
                        text: "La copa se ha actualizado satisfactoriamente.",
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