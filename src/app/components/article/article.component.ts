import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';

import { Browser } from '@capacitor/browser';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';

import { Article } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {

  @Input() article: Article;
  @Input() index: number = 0;

  constructor( private actionSheetCtrl: ActionSheetController,
               private platform: Platform,
               private storageService: StorageService) { }

  ngOnInit() {}

  async openArticle() {
    await Browser.open({ url: this.article.url });
  }

  async onOpenSettings() {

    const articleInFavorites = this.storageService.inFavorites( this.article );

    const buttons: ActionSheetButton[] = [
      {
        text: articleInFavorites ? 'Remover favorito' : 'Favorito',
        icon: articleInFavorites ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ]
    
    const share = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if ( this.platform.is('capacitor') ){
      buttons.unshift( share );
    }
    
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons
    });

    await actionSheet.present();

  }

  onShareArticle() {

    const { title, source, url } = this.article;

    SocialSharing.share(
      title,
      source.name,
      undefined,
      url
    )
  } 

  onToggleFavorite() {
    console.log('favorite');

    this.storageService.saveRemoveArticle(this.article);
  }

}
