var kickoff_sorteo = {
    template: '#kickoff-sorteo',
    data:()=>({
        liga:[],

        equipos:null,
        mostrar:false,
        mensaje:null

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
                    if(response.body.liga.estado == 3){
                        this.mensaje = "En espera del kickoff"
                        this.mostrar= false;
                    }else if(response.body.liga.estado == 1){
                        this.mensaje = "Proceso de kickoff completo";
                        this.mostrar= false;
                    }else{
                        this.liga=response.body.liga;
                        this.cargar_lista();
                        this.mostrar=true;
                    }
                    console.log(response.body.id_equipo)


                }else{
                   // swal('Acceso denegado', 'No perteneces a ninguna Liga', 'error' );
                   this.mensaje = "No perteneces a ninguna liga"
                   this.mostrar= false;

                }

            });
        },


        cargar_lista(){

            let where = { liga_id:this.liga.id };
            this.$http.post('cargar_datos_all?view',{ tabla:'equipos', where:where, orderby:'turno_kickoff' }).then(function(response){
                console.log(response.body)
                if( response.body.resultado ){
                    this.mostrar = true;
                    this.equipos = response.body.data;
                    for (let index = 0; index < this.equipos.length; index++) {
                        console.log(this.equipos[index].fecha_kickoff)
                       this.equipos[index].fecha_kickoff=  moment(this.equipos[index].fecha_kickoff).format('DD-MM-YYYY') + ' a las ' + moment(this.equipos[index].fecha_kickoff).format('hh:mm A');
                    }
                }
            });
        },
    }
  }