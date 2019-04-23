var subastas_ligas = {
    template: '#subastas-ligas',
    data:()=>({
      //entorno_room:'chat_subasta',
    lista_jugadores:[],
      lista_ligas:[],
      liga:'',
      datos_liga : [],
      mostrar:false,
      mensaje:'',
    }),
    watch:{
    },
    created:function(){
    },
    mounted:function(){
     /* alert(location.protocol);
      if (location.protocol == 'https:')
      {
      location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
      alert("d")

      }*/
      this.cargar_datos_usuario();

      //this.cargar_ligas_usuario();
    },
    methods:{
      cargar_datos_usuario(){

        this.$http.post('cargar_datos_usuario?view',{}).then(function(response){
            if( response.body.resultado ){
                this.datos_liga = response.body.data;

                console.log(this.datos_liga);
                if(this.datos_liga.temporada_estado == 4 ){
                  this.cargar_jugadores_subastas();

                }else{
                    this.mostrar = false;
                    this.mensaje = "No estas en período de subastas."
                }
            }else{
                this.mensaje = "No perteneces a ninguna liga"
                this.mostrar= false;
            }
        });

      },
      iniciar_subasta(params,$event){

        let obj = {liga_id:params.liga_id,jugador_id:params.jugadores_id,precio_base_jugador:params.precio_base_jugador,subastas_liga:"1"};
        this.$http.post('iniciar_subasta?view',obj).then(function(response){
          let data = response.body;
          if (data.resultado) {
            socket_chat.emit('iniciar_subasta',(params));
            $($event.target).css("background-color","#28a745");
            $($event.target).html("Subasta Iniciada");
            swal({
              title: "Subasta Iniciada",
              text:data.mensaje,
              icon: "success",
              buttons: false,
              dangerMode: false,
            })
            setTimeout(() => {
              window.location.reload(true);
          }, 2000);
          }else{
            swal("Error", data.mensaje, "warning");
          }
        });
      },
      cargar_jugadores_subastas(){
        let obj = {subastas_liga:"1"};
        this.$http.post('cargar_jugadores_subastas?view',obj).then(function(response){
          let data = response.body;
          console.log(data);
          if( data.resultado ){
            this.lista_jugadores=data.jugadores;
        //    $('.iniciar_periodo_subasta').remove();
            this.mostrar= true;
          }else{
          //  $('.iniciar_periodo_subasta').css("display","block");
            this.mensaje = "No cuentas con jugadores en subastas"
            this.mostrar= false;

           // swal("Sin subastas", "Por ahora usted no cuenta con jugadores en subasta", "warning");
          }
        });
      },
      iniciar_periodo_subasta(){
        this.$http.post('iniciar_periodo_subasta?view').then(function(response){
          let data = response.body;
          if (data.resultado) {
            this.cargar_jugadores_subastas();
            swal("Subastas Iniciada", data.mensaje, "success");
            //this.mensaje_entre_componentes(params.liga_id,params.jugadores_id);
            //window.location.hash = 'subasta';
          }else{
            swal("Error", data.mensaje, "warning");
          }
        });
      },
      /*cargar_ligas_usuario(){
        this.$http.post('cargar_ligas_usuario?view').then(function(response){
          let data = response.body;
          console.log(data);
          if( data.resultado ){
            this.lista_ligas=data.ligas;
            this.liga = data.ligas[0].liga_id;
          }else{
            swal("Sin Ligas", "Por ahora usted no cuenta con ligas creadas activas", "warning");
          }
        });
      },*/
      mensaje_entre_componentes(liga_participantes_id,jugador_id){
        var input = document.createElement("input");
        input.type = "hidden";
        input.id = "mensaje_entre_componentes";
        input.setAttribute("data-liga_participantes_id",liga_participantes_id);
        input.setAttribute("data-jugador_id",jugador_id);
        document.body.appendChild(input); // put it into the DOM
      }
    }
  }