var equipos_configuracion = {
    template: '#equipos-configuracion',
    data:()=>({
        nombre_equipo:null,
        equipo:[],
        mostrar:false,
        mensaje:null,
        datos_liga:[],
        mostrar_nombre:true,

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
                    if(this.datos_liga.eliminado==0){
                        this.cargar_equipo();
                        if(this.datos_liga.estado==2){

                            this.mostrar_nombre=false;
                        }else{

                            this.mensaje = "Ya no puedes cambiar la configuración de tu equipo.";
                            this.mostrar=false;
                        }
                    }else{
                        this.mensaje = "Tu equipo ha sido eliminado.";
                        this.mostrar=false;
                    }


                }else{
                    this.mensaje = "No perteneces a ninguna liga";
                    this.mostrar=false;
                }
            });
        },


        cargar_equipo(){
            this.equipo = [];
            let tabla = 'equipos';
            let where = {id:this.datos_liga.id};
            let campos = '*';
            this.$http.post('cargar_datos?view',{tabla:tabla,where:where,campos:campos}).then(function(response){
                if( response.body.resultado ){
                    this.mostrar=true;
                    console.log(response.body.data)
                    this.equipo= response.body.data;
                    this.avatar = response.body.data.avatar;
                    this.nombre_equipo =  response.body.data.nombre;
                }else{
                    swal("Error", "Un error ha ocurrido", "error");
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

            if(this.nombre_equipo==''){
                swal("", "El equipo tiene que tener un nombre", "warning");
                return false;
            }
            var self = this;
            var formData = new FormData(document.getElementById("formuploadajax"))
            formData.append("archivo",document.getElementById('archivo'));
            formData.append("equipo_id",self.equipo.id);
            formData.append("equipo_nombre",self.nombre_equipo);
            formData.append("tipo_documento",self.tipo_documento);
            this.$http.post('configuracion_equipo?view',formData,{headers: {'Content-Type': 'multipart/form-data'}}).then(function(response){
                if (response.body.resultado) {

                    swal({
                        title: "",
                        text: "Equipo actualizado satisfactoriamente.",
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