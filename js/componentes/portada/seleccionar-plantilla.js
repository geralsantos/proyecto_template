var seleccionar_plantilla = {
    template: '#seleccionar-plantilla',
    data:()=>({
        teams:null,
        team:null,
        jugadores:[],
        jugadores_array:[],
        id_equipo:null,
        id_liga:null,
        liga_participante_id:null,
        grupo_rubro:[],
        formulario_kickoff:3,
        mensaje:'',
        refuerzos: [],
        estrellas:[],
        jugador_estrella:null,
        refuerzo_1:null,
        refuerzo_2:null,
        equipo:[],
        liga:[],
        loader:false,
    }),
    created:function(){
    },
    mounted:function(){

        this.cargar_id_equipo();

    },
    updated:function(){

    },
    methods:{
        cargar_id_equipo(){

            this.$http.post('cargar_id_equipo?view',{}).then(function(response){
                console.log(response.body)
                if( response.body.resultado ){
                    console.log(response.body)
                    this.equipo = response.body.equipo;
                    this.liga_participante_id= response.body.liga_participante_id;
                    this.liga = response.body.liga;
                    if(response.body.equipo.registro_plantilla==1){
                        this.formulario_kickoff = 2;
                        this.team = response.body.equipo.teams_id;
                        this.jugadores_array =response.body.equipo.jugadores;
                        this.id_liga = response.body.liga.id;

                        this.cargar_jugador_estrella();


                    }else if(response.body.equipo.registro_plantilla==2){
                        this.formulario_kickoff = 3;
                        this.mensaje = 'Tu plantilla está completa';
                    }else{
                        if(response.body.equipo.fecha_kickoff){
                            if( moment().format("YYYY-MM-DD HH:mm:ss") > response.body.equipo.fecha_kickoff ){
                                //puede generar
                                this.id_equipo= response.body.equipo.id;
                                this.liga_participante_id= response.body.liga_participante_id;
                                this.id_liga= response.body.liga.id;
                                this.formulario_kickoff =1;
                                this.cargar_teams();
                            }else{
                                //todavía no inica kickoff
                                this.formulario_kickoff = 3;
                                this.mensaje = 'Tu fecha de kickoff inicia el ' + moment(response.body.equipo.fecha_kickoff).format('DD-MM-YYYY') + ' a las ' + moment(response.body.equipo.fecha_kickoff).format('hh:mm A');
                            }
                        }else{
                            this.mensaje = 'En espera de kickoff';
                        }


                    }


                }else{
                   // swal('Acceso denegado', 'No perteneces a ninguna Liga', 'error' );
                    this.formulario_kickoff = 3;
                    this.mensaje = "No perteneces a ninguna Liga";

                }

            });
        },


        guardar(){
            if(this.jugadores_array.length<15){
                swal("Alerta", "Debes seleccionar 15 jugadores", "warning");
                return false;
            }
            let objeto = JSON.stringify(this.jugadores_array);
            let values = {"jugadores":objeto, "teams_id":this.team, "registro_plantilla":1 };
            let where = {"id":this.id_equipo};
            let jugadores = this.jugadores_array;
            let liga_participante = this.liga_participante_id;
            let liga = this.id_liga;
            this.loader = true;
            this.$http.post('guardar_jugadores?view',{values:values, where:where, jugadores:jugadores, liga:liga,liga_participante:liga_participante}).then(function(response){
                this.loader = false;
                if( response.body.resultado ){

                    swal({
                        title: "",
                        text: response.body.mensaje,
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
                        dangerMode: true,
                      })
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                  }
            });

        },
        cargar_equipo(){
            this.jugadores_array=[];
            this.$http.post('cargar_jugadores?view',{teams_id:this.team}).then(function(response){
                if( response.body.resultado ){
                    this.jugadores= response.body.jugadores;
                }
            });
        },
        guardar2(){
            if( this.jugador_estrella=='' || this.refuerzo_1=='' || this.refuerzo_2==''){
                swal("","Debe seleccionar todos sus refuerzos y jugador estrella", "warning");
                return false;
            }
            if(this.refuerzo_1 == this.refuerzo_2){
                swal("Alerta", "No puedes elegir a los mismos refuerzos", "warning");
                return false;
            }
            let new_array = JSON.parse(this.jugadores_array);
            new_array.push(this.refuerzo_1);
            new_array.push(this.refuerzo_2);
            new_array.push(this.jugador_estrella);

            new_array = JSON.stringify(new_array);
            this.loader=true;
            this.$http.post('kickoff_paso_2?view',{refuerzo_1:this.refuerzo_1, refuerzo_2:this.refuerzo_2, jugador_estrella:this.jugador_estrella, equipo:this.equipo.id, liga:this.liga.id, liga_participante:this.liga_participante_id, jugadores:new_array}).then(function(response){
                this.loader=false;
                if( response.body.resultado ){
                    swal({
                        title: "",
                        text: response.body.mensaje,
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
                        dangerMode: true,
                      })
                      setTimeout(() => {
                        window.location.reload(true);
                    }, 3000);
                  }
            });

        },
        cargar_teams(){

            //cargar solo con oveall grupal menor a 79
            this.$http.post('cargar_teams?view',{liga_id:this.id_liga}).then(function(response){
                console.log("cargar-teams")
                console.log(response.body)
                if( response.body.resultado ){
                   this.teams= response.body.teams;
                }
            });
        },

        cargar_refuerzos(){
            this.loader = true;
            this.$http.post('cargar_refuerzos?view',{jugadores_seleccionados:this.jugadores_array, liga_id:this.id_liga}).then(function(response){
                this.loader = false;
                if( response.body.resultado ){
                   this.refuerzos= response.body.jugadores;

                }
            });
        },

        cargar_jugador_estrella(){
            this.loader = true;
            this.$http.post('cargar_jugador_estrella?view',{jugadores_seleccionados:this.jugadores_array, liga_id:this.id_liga}).then(function(response){
                this.loader = false;
                if( response.body.resultado ){
                   this.estrellas= response.body.jugadores;
                   this.cargar_refuerzos();
                }
            });
        },
        verificar(id){
            if(this.jugadores_array.length > 15 ){
              this.jugadores_array.splice(-1,1)
             swal("Alerta", "No puedes agregar mas de 15 jugadores", "warning");
            }
            $('#'+id).prop('checked',false);

        },

    }
  }