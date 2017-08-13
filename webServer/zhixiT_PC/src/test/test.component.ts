import { Component } from '@angular/core';
import { TestService } from '../../services/test/test.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'test',
  templateUrl: 'module/test/test.html',
  styleUrls: ['module/test/test.css'],
  providers: [ TestService ]
})
export class Test implements OnInit { 

  constructor(private testService: TestService) { }

  ngOnInit(): void {

  }

  // getHeroes(): void {
  //   this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  // }

}