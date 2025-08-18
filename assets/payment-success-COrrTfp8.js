import{r as t,j as e,C as o,e as c,aA as d,f as m,a as x,a1 as h,L as a,h as l,bi as u}from"./index-CeACcdR0.js";import{C as f}from"./credit-card-BeYrZ9L8.js";function j(){const[r,i]=t.useState(!0);return t.useEffect(()=>{const s=setTimeout(()=>i(!1),3e3);return()=>clearTimeout(s)},[]),e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4",children:[r&&e.jsx("div",{className:"fixed inset-0 pointer-events-none z-50",children:e.jsx("div",{className:"confetti-container",children:Array.from({length:50}).map((s,n)=>e.jsx("div",{className:"confetti-piece",style:{left:`${Math.random()*100}%`,animationDelay:`${Math.random()*3}s`,backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6"][Math.floor(Math.random()*5)]}},n))})}),e.jsx("div",{className:"max-w-2xl w-full",children:e.jsxs(o,{className:"bg-slate-900/50 border-green-500/30 shadow-2xl",children:[e.jsxs(c,{className:"text-center pb-8",children:[e.jsx("div",{className:"mx-auto mb-6 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center",children:e.jsx(d,{className:"w-12 h-12 text-white"})}),e.jsx(m,{className:"text-3xl font-bold text-white mb-4",children:"Payment Successful!"}),e.jsx("p",{className:"text-xl text-slate-300",children:"Thank you for your purchase. Your payment has been processed successfully."})]}),e.jsxs(x,{className:"space-y-8",children:[e.jsxs("div",{className:"bg-slate-800/50 rounded-lg p-6 border border-slate-700",children:[e.jsxs("h3",{className:"text-lg font-semibold text-white mb-4 flex items-center gap-2",children:[e.jsx(h,{className:"w-5 h-5 text-blue-400"}),"What happens next?"]}),e.jsxs("ul",{className:"space-y-3 text-slate-300",children:[e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"}),e.jsx("span",{children:"Your FLBY tokens will be added to your account within 5-10 minutes"})]}),e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"}),e.jsx("span",{children:"You'll receive an email confirmation with transaction details"})]}),e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"}),e.jsx("span",{children:"All premium features are now unlocked and ready to use"})]}),e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"}),e.jsx("span",{children:"Start creating AI-powered messages and tokens immediately"})]})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4",children:[e.jsx(a,{href:"/home",className:"flex-1",children:e.jsxs(l,{className:"w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3",children:[e.jsx(u,{className:"w-4 h-4 mr-2"}),"Go to Dashboard"]})}),e.jsx(a,{href:"/mint",className:"flex-1",children:e.jsxs(l,{variant:"outline",className:"w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-3",children:[e.jsx(f,{className:"w-4 h-4 mr-2"}),"Create Your First Token"]})})]}),e.jsx("div",{className:"text-center text-sm text-slate-400 bg-slate-800/30 rounded-lg p-4",children:e.jsxs("p",{children:["Need help? Contact our support team at"," ",e.jsx("a",{href:"mailto:support@flutterbye.com",className:"text-blue-400 hover:text-blue-300",children:"support@flutterbye.com"})]})})]})]})}),e.jsx("style",{jsx:!0,children:`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.9;
          animation: confetti-fall 3s linear forwards;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `})]})}export{j as default};
