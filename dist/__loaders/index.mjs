const r=o=>()=>import(`../${o}.mjs`).then(e=>({default:e[o]}));export{r as loadIcon};
