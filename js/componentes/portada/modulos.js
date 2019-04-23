var portada_index2 = {
  template: '#portada-index',
  data:()=>({


  }),
  created:function(){
  },
  mounted:function(){

    this.cargar();
    this.mostrar_grafico();
  },
  updated:function(){

  },
  methods:{
    cargar(){
        console.log("11111")
    },

    mostrar_grafico(){

      Highcharts.chart('grafico-portada', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Estadísticas',
            align: 'center',
            verticalAlign: 'middle',
            y: 40
        },
        subtitle:{
          text:'Alianza Lima',
          align: 'center',
            verticalAlign: 'middle',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits:{
          enabled:false
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Partidos',
            innerSize: '50%',
            data: [
                ['Ganados',10],
                ['Perdidos', 3],
                ['Empates', 3],

            ]
        }]
    });
    }

  }
}