import { Component, OnInit } from '@angular/core';
import { IndexSService } from '../index-s/index-s.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserInfo } from '../index-s/index-s.model';

@Component({
  selector: 'app-select-book',
  templateUrl: './select-book.component.html',
  styleUrls: ['./select-book.component.css']
})
export class SelectBookComponent implements OnInit {

  books = [];
  userInfo: UserInfo = new UserInfo;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private indexSService: IndexSService
  ) { }

  ngOnInit() {
    this.indexSService.loadBooks(localStorage.getItem("ver"), localStorage.getItem("grade")).then(books => {
      this.books = books.list
    });
  }

  selectBook(book): void{
    this.router.navigate(['indexS/selectQuestion',book.ver_id]);
  }
}
