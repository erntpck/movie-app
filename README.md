## Kurulum ve Çalıştırma

```bash
pnpm i
pnpm run ios

movie-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           
│   │   └── _layout.tsx         
│   ├── movie/
│   │   ├── [id].tsx            
│   │   └── add.tsx            
│   ├── _layout.tsx            
│   └── index.tsx              
│
├── components/
│   ├── MovieCard.tsx           
│   └── MovieForm.tsx          
│
├── store/
│   ├── index.ts               
│   └── api/
│       └── moviesApi.ts       
│
├── slices/
│   ├── favoritesSlice.ts       
│   ├── filterSlice.ts         
│   └── themeSlice.ts           
│
├── db.json                    
├── global.css                 
├── metro.config.js             
├── tailwind.config.js          
├── app.json                    
└── package.json
