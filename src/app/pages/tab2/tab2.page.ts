import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  @ViewChild(IonInfiniteScroll, { static: true}) infiniteScroll: IonInfiniteScroll;

  public headlines: string[] = ['business','entertainment','general','health','science','sports','technology'];
  public selectedHead: string = this.headlines[1];
  public articles: Article[] = [];

  constructor( private newsService: NewsService ) {}

  ngOnInit(): void {

    this.actualizarHeadlines();
 
  }

  segmentChanged( event: Event ){
    this.selectedHead = (event as CustomEvent).detail.value;
    this.actualizarHeadlines();
  }

  actualizarHeadlines() {
    this.newsService.getTopHeadlinesByCategory( this.selectedHead )
      .subscribe( art => {
        this.articles = [ ...art];
      });
  }

  loadData(){

    this.newsService.getTopHeadlinesByCategory( this.selectedHead, true )
      .subscribe( articles => {

        if ( articles[articles.length - 1].title === this.articles[this.articles.length - 1].title ){
          this.infiniteScroll.disabled = true;
          return;
        }

        this.articles = articles;
        this.infiniteScroll.complete();
      })
  }

}
