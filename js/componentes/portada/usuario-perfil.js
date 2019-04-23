{
  'use strict';
  var usuario_perfil = {
    template: '#usuario-perfil',
    data:()=>({
      nombre: null,
      apellido: null,
      correo: null,
      usuario : null,
      clave: null,
      usuario:[],
      usuario_id: null,
      perfil:[],
      mostrar:false,
    }),
    created:function(){
    },
    mounted:function(){
      this.cargar();
    },
    updated:function(){

    },
    methods:{
      cargar(){
          this.usuario_id = $("#id_usuario").val();
          where = {'estado':1, 'id': this.usuario_id };
          this.$http.post('cargar_datos?view',{tabla:'usuarios',where:where, campos:'*'}).then(function(response){

            if(response.body.data != undefined){
              this.perfil = response.body.data;
              this.nombre = response.body.data.nombre
              this.apellido = response.body.data.apellido;
              this.clave =  response.body.data.clave;
              this.usuario =  response.body.data.usuario;
              this.correo =  response.body.data.correo;
              console.log(this.perfil.id_fb)
              if(this.perfil.id_fb!=null){
                this.mostrar=false;
              }else{
                this.mostrar=true;
              }

            }
          });
        },
      actualizar(){
          let campos ={};
          if(this.perfil.id_fb!=null){
            campos = {
              "id":this.usuario_id,
              "nombre":this.nombre,
              "apellido":this.apellido,
              "correo":this.correo,

              };

          }else{
            campos = {
              "id":this.usuario_id,
              "nombre":this.nombre,
              "apellido":this.apellido,
              "correo":this.correo,
              "usuario":this.usuario,
              "clave":this.clave,
              };

          }

          let where = { "id":this.usuario_id };
          this.$http.post('actualizar_usuarios?view',{campos:campos,where:where}).then(function(response){
            if( response.body.resultado ){
              swal({
                title: "",
                text:"Usuario actualizado.",
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
                text: "Ha ocurrido un error. Intente de nuevo.",
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
}
