import { Component, OnInit } from '@angular/core';
import { IndexSService } from '../index-s/index-s.service';
const Highcharts = require('highcharts');
require('highcharts/highcharts-more')(Highcharts);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  options: Object;
  total: number = 1;
  perfect: number = 0;
  excellent: number = 0;
  pass: number = 0;
  fail: number = 0;

  constructor(
    private indexSService: IndexSService
  ) {}

  ngOnInit() {
    this.indexSService.loadStatisticsInfo().then(res => {
        this.total = res.info.questions.total;
        this.perfect = res.info.questions.perfect;
        this.excellent = res.info.questions.excellent;
        this.pass = res.info.questions.pass;
        this.fail = res.info.questions.fail;
        this.options = {
          credits: {
              enabled: false
          },
          navigation: {
              buttonOptions: {
                  enabled: false
              }
          },
          title: {
              enabled: false,
              text: '学生答题统计'
          },
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              backgroundColor: '#f0f2f6',
              type: 'pie'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                          color: 'black'
                      }
                  }
              }
          },
          series: [{
              name: '占比',
              colorByPoint: true,
              data: [{
                  name: '完美',
                  y: this.perfect,
                  color: '#f968f1'
              }, {
                  name: '优秀',
                  y: this.excellent,
                  color: '#6ae1f3'
              }, {
                  name: '及格',
                  y: this.pass,
                  color: '#4289ff'
              }, {
                  name: '不及格',
                  y: this.fail,
                  color: '#4759bd'
              }]
          }]
      };
    });
  }

}
