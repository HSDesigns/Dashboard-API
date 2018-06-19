import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as ctAxisTitle from 'chartist-plugin-axistitle/dist/chartist-plugin-axistitle.js';
import * as ctThreshold from 'chartist-plugin-threshold/dist/chartist-plugin-threshold.js';
import * as Papa from 'papaparse/papaparse.min.js';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CsvParserService } from '.././csv-parser.service';

declare var $: any;
interface Post {
  title: string;
  status: string;
}
@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class DashboardComponent implements OnInit {
    users: Array<any>;
    // postsCol: AngularFirestoreCollection<Post>;
    posts: Observable<Post[]>;
    barChartVertical: any;
    momChartVertical;
    pieChart;
    barChartHor;
    serverDataVert;
    serverDataPie;
    serverMOMVertData;
    pieOpt;
    barOptions: any;
    // State for dropzone CSS toggling
    isHovering: boolean;
    isGrayed: boolean;
    name: string;
    saleAmt: string;
    // private afs: AngularFirestore in constructor
    constructor(private dataService: CsvParserService) {
    }
    toggleHover(event: boolean) {
        this.isHovering = event;
    }
    startUpload(event: FileList) {
        // The File object
        const file = event.item(0);
        // if (file.type.split('/')[1] !== 'vnd.ms-excel') {
        //     this.dataService.showNotification('top', 'right', this.dataService.updtMessages[2],
        //     this.dataService.colors[3], 'ti-face-sad');
        //     return;
        // }else {
            // Papa.parse(file, this.config);
        //     });
        let dataset;
        Papa.parse(file, {
            delimiter: '',	// auto-detect
            newline: '',	// auto-detect
            quoteChar: '"',
            header: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    this.dataService.showNotification('top', 'right', this.dataService.updtMessages[2],
                        this.dataService.colors[3], 'ti-face-sad');
                        console.log('Errors Encountered');
                        console.log(results.errors);
                        return;
                }
                dataset = results.data;
                console.log('Raw-data');
                console.log(dataset);
                this.dataService.updateCharts(dataset, this.momChartVertical, this.barChartVertical, this.pieChart);
                this.setPreviewData();
                this.dataService.showNotification('top', 'right', this.dataService.updtMessages[0],
                this.dataService.colors[1], 'ti-face-smile');
                this.isGrayed = false;
            },
            skipEmptyLines: true
        });
        // }
    }
    setPreviewData() {
        this.name = this.dataService.topCustomer.name;
        this.saleAmt = this.dataService.topCustomer.salesAmt;
    }
    undoUpdate() {
        this.isGrayed = true;
        this.barChartVertical.update(this.serverDataVert);
        this.pieChart.update(this.serverDataPie, this.pieOpt);
        this.momChartVertical.update(this.serverMOMVertData);
        this.name = this.dataService.serverTopCustomer.name; this.saleAmt = this.dataService.serverTopCustomer.salesAmt;
        this.dataService.showNotification('top', 'right', this.dataService.updtMessages[1], this.dataService.colors[0],
        'ti-face-smile');
    }
    getTopData() {
        this.dataService.getUsers()
            .subscribe(res => this.dataService.mapValues(res, this.barChartVertical, 'bar')
                // this.users = res
            );
    }
    ngOnInit() {
        this.isGrayed = true;
        this.name = this.dataService.topCustomer.name;
        this.saleAmt = this.dataService.topCustomer.salesAmt;
    //   this.postsCol = this.afs.collection('stats');
    //  this.posts = this.postsCol.valueChanges();
      //  var dataSales = {
        /*  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          series: [
             [10,12,15,12,14.5,16],
            [2,2.8,3,4,4.4,6]
          ]
        };

        var optionsSales = {
          low: 0,
          high: 20,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
            createLabel :Chartist.createLabel(

            ),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales: any[] = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);*/
        const momVertData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
            [3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]]
        };

        const momVertOptions = {
            chartPadding: {
                top: 20,
                right: 0,
                bottom: 20,
                left: 0
            },
            axisY: {
                onlyInteger: true
            },
            plugins: [
                ctAxisTitle({
                    axisX: {
                        axisTitle: 'Month',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: 50
                        },
                        textAnchor: 'middle'
                    },
                    axisY: {
                        axisTitle: 'Sale Amount',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: -1
                        },
                        flipTitle: false
                    }
                })
            ]
        };
        this.serverMOMVertData = Object.assign({}, momVertData);
        console.log('MOM Data Vertical');
        console.log(this.serverMOMVertData);
        this.momChartVertical = new Chartist.Bar('.ct-chart', momVertData, momVertOptions);
        // Vertical Bar chart
        const dataPreferences = {
            labels: ['Cust 1', 'Cust 2', 'Cust 3', 'Cust 4', 'Cust 5', 'Cust 6', 'Cust 7', 'Cust 8', 'Cust 9', 'Cust 10'],
            series: [1.2, 2, 2.5, 4.8, 7.2, 8.2, 9.2, 10.2, 11.2, 12.2]
        };

        const optionsPreferences = {
          distributeSeries: true,
          plugins: [
            ctThreshold({
              threshold: 2,
                  classNames: {
                      aboveThreshold: 'ct-threshold-above',
                      belowThreshold: 'ct-threshold-below'
                  }
            }
          ),
              ctAxisTitle({
                  axisX: {
                      axisTitle: 'January',
                      axisClass: 'ct-axis-title',
                      offset: {
                          x: 0,
                          y: 38
                      },
                      textAnchor: 'middle'
                  },
                  axisY: {
                      axisTitle: 'Sale Amount',
                      axisClass: 'ct-axis-title',
                      offset: {
                          x: 0,
                          y: 0
                      },
                      flipTitle: false
                  }
              })

          ]

        };
        this.serverDataVert = Object.assign({}, dataPreferences);
        console.log('Server Data Vertical');
        console.log(this.serverDataVert);
        this.barChartVertical = new Chartist.Bar('#chartPreferences', dataPreferences, optionsPreferences);
        // Pie chart
        const sum = (a, b) => a + b;
        const pieData = {
            data: ['Cash', 'Credit', 'Mixed'],
            series: [20, 15, 40]
        };
        this.serverDataPie = Object.assign({}, pieData);
        const pieOptions = {
            labelInterpolationFnc: function (value, id) {
                return `${Math.round(value / pieData.series.reduce(sum) * 100)}% ${pieData.data[id]}`;
            }
        };
        this.pieOpt = Object.assign({}, pieOptions);
        this.pieChart = new Chartist.Pie('#chartActivity', pieData, pieOptions);
            // Horizontal bar chart
        new Chartist.Bar('#chartHighCreditMOP', {
            labels: ['Quater 1', 'Quater 2', 'Quater 3', 'Quater 4'],
            series: [
                [5, 4, 3, 7],
                [3, 2, 9, 5]
            ]
        }, {
            seriesBarDistance: 10,
            reverseData: false,
            horizontalBars: true,
            axisY: {
                offset: 70
            },
            plugins: [
                ctAxisTitle({
                    axisX: {
                        axisTitle: 'Sale Amount',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: 32
                        },
                        textAnchor: 'middle'
                    },
                    axisY: {
                        axisTitle: 'Quaters',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: 0
                        },
                        flipTitle: false
                    }
                })
            ]
        });


    }
}
