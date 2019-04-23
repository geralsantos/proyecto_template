var equipos_estadisticas =  {
    template: '#equipos-estadisticas',
    data:()=>({
        nombre_equipo:null,
        equipo:[],
        jugadores:[],
        plantilla :[],
        equipos:[],
        partidos_ganados: 0,
        partidos_empatados: 0,
        partidos_perdidos: 0,
        temporadas:[],
        temporada: [],
        equipos_posicion:[],
        posicion_liga:null,
        datos_liga:[],
        mostrar:false,
        mensaje:null,
        ver_grafico_1:false,
        submensaje:null


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
                    this.cargar_equipos();
                    this.mostrar= true;

                }else{
                    this.mensaje = "No perteneces a ninguna liga"
                    this.mostrar= false;
                }
            });

        },

        cargar_equipos(){
            this.submensaje=null;

            this.$http.post('cargar_equipos?view',{}).then(function(response){
                if( response.body.resultado ){
                    this.equipos= response.body.equipos;

                    for(var i= 0; i <  this.equipos.length; i++) {
                        let jugadores = JSON.parse(this.equipos[i].jugadores);
                    let num =(jugadores.length != undefined)?jugadores.length:0;
                    this.equipos[i].jugadores_num =num;
                    }
                    console.log(this.equipos)

                }else{
                swal("Error", "Un error ha ocurrido", "danger");
                }
            });
        },
        cargar_temporadas(){
            let where = {liga_id:this.equipo.liga_id}
            this.$http.post('cargar_datos_all?view',{ tabla:'temporada_liga', where:where, orderby:'id'}).then(function(response){
                if(response.body.resultado){
                    this.temporadas = response.body.data;
                }else{

                    swal("", "Todavìa no inicia la temporada", "warning");
                    this.equipos=[];
                    this.temporadas=[];
                    this.equipo=[];
                    this.ver_grafico_1=false;
                    this.cargar_equipos();
                }

            });
        },
        cargar_equipo(){
            console.log(this.equipo)
            if(this.equipo.eliminado==1){
                this.submensaje='El equipo ha sido eliminado de la liga.';
                this.ver_grafico_1=false;
            }else{
                this.nombre_equipo = this.equipo.nombre;

            this.$http.post('buscar_equipo_estadisticas?view',{ equipo_id:this.equipo.id, liga_id:this.equipo.liga_id, temporada_id:this.temporada.id}).then(function(response){
                if(response.body.resultado){

                    if(response.body.data.temporada_estado!=2){

                        console.log(response.body.data)
                        this.partidos_ganados = (response.body.data.partidos_ganados)?parseInt(response.body.data.partidos_ganados):0;
                        this.partidos_empatados = (response.body.data.partidos_empatados)? parseInt(response.body.data.partidos_empatados):0;
                        this.partidos_perdidos = (response.body.data.partidos_perdidos)? parseInt(response.body.data.partidos_perdidos):0;

                        if(this.partidos_ganados==0 && this.partidos_empatados==0 && this.partidos_perdidos==0 ){
                            this.submensaje='No hay resultados registrados';
                            this.ver_grafico_1=false;
                        }else{
                            this.ver_posicion_liga();
                            this.ver_grafico_1=true;
                        }

                    }else{
                        this.submensaje='Todavìa no inicia la temporada';
                    }



                }

            });
            }

        },
        ver_posicion_liga(){

            let liga_id = this.equipo.liga_id;
            let temporada_id = this.equipo.temporada_id;
            this.$http.post('buscar_equipos_tabla_by_temporada?view',{liga_id:liga_id, temporada_id:temporada_id}).then(function(response){
                if(response.body.resultado){
                    this.equipos_posicion=response.body.data;
                    console.log(response.body.data)
                    this.equipos_posicion.sort(compare);
                    for (let i = 0; i < this.equipos_posicion.length; i++) {


                        if(this.equipos_posicion[i].id==this.equipo.id ){
                            this.posicion_liga = i+1;
                            break;
                        }
                    }
                    this.ver_grafico();
                }


            });
        },

        ver_grafico(){
            Highcharts.chart('grafico-estadisticas-equipos', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Estadísticas: Equipo '+ this.nombre_equipo
                },
                subtitle: {
                    text: 'Posición en la liga: N° ' + this.posicion_liga
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y} </b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true,
                    }
                },
                series: [{
                    name: 'Partidos',
                    colorByPoint: true,
                    data: [{
                        name: 'Ganados: ' + this.partidos_ganados,
                        y: this.partidos_ganados,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Perdidos: ' + this.partidos_perdidos,
                        y: this.partidos_perdidos
                    }, {
                        name: 'Empatados: ' + this.partidos_empatados,
                        y: this.partidos_empatados
                    }]
                }]
            });
        }


    }
  }