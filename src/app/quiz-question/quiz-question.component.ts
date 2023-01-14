import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css']
})
export class QuizQuestionComponent implements OnInit {

  public name : string=""
  public questionList:any = []
  public currentQue:number = 0
  public marks:number=0
  count = 60
  correctAnswer:number=0
  isCorrect : number = 0
  interval$ :any
  progress : string = "0"
  quizCompleted:boolean=false
  constructor(private service:QuestionService){}

  ngOnInit():void{
    this.name = localStorage.getItem('name')!;
    this.getAllQuestion()
    this.startCount()
  }


  getAllQuestion(){
    this.service.getQuestion()
    .subscribe((res)=>{
      this.questionList = res
    })
    
  }

  nextQue(){
    this.currentQue++
  }

  preQue(){
    this.currentQue--
  }

  answer(Qno:number,option:any){
    if(Qno===this.questionList.length){
      this.quizCompleted = true
      this.stopCount()
    }
     if(option.correct){
      this.marks += 10
      this.correctAnswer++
      setTimeout(() => {
        this.currentQue++
        this.resetCount()
        this.getProgress()
      }, 1000);
    
     
     }else{
      setTimeout(() => {
        this.currentQue++
        this.isCorrect++
        this.resetCount()
        this.getProgress()
      }, 1000);
     this.marks-=10
     }
  }

  startCount(){
     this.interval$ = interval(1000)
     .subscribe((val)=>{
      this.count--
      if(this.count===0){
        this.currentQue++
        this.count=60
        this.marks-=10
      }
     })
     setTimeout(() => {
      this.interval$.unsubscribe()
     }, 600000);
  }

  stopCount(){
     this.interval$.unsubscribe()
     this.count=0
  }

  resetCount(){
     this.stopCount()
     this.count=60
     this.startCount()
  }

  reset(){
    this.resetCount()
    this.getAllQuestion()
    this.marks = 0
    this.count=60
    this.currentQue=1
    this.progress="0"
  }

  getProgress(){
    this.progress = ((this.currentQue/this.questionList.length)*100).toString()
    return this.progress
  }
}
