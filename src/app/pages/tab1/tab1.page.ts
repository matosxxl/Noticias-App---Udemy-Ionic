import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public articles: Article[] = [];

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor( private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getTopHeadlines()
      .subscribe( articles => {
        this.articles.push( ...articles );
        // this.articles = [ ...articles, ...this.articles ];
      });
  }

  loadData() {
    
    this.newsService.getTopHeadlinesByCategory('entertainment')
      .subscribe( articles => {
        if (this.articles.length != articles.length){
          this.articles = articles;
          this.infinite.complete();
          return;
        } 
        
        this.newsService.getTopHeadlinesByCategory('entertainment', true)
          .subscribe( art => {
            
            if ( this.articles[this.articles.length - 1].title === art[art.length - 1].title ){
              this.infinite.disabled = true;
              return;
            }

            this.articles = art;
            this.infinite.complete();

          });
      })

  }

}
