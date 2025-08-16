'use client';
import dynamic from 'next/dynamic'
import Image from  'next/image'
import Link from 'next/link'

//import SchemaProduto from './SchemaProduto';


const SchemaProduto = dynamic(() => import('./SchemaProduto'), { ssr: false })


export default function ProdutoAwin(props) {
  const {
    produto,
	mybrand

  } = props;

 // const caminho =  mybrand.toLowerCase().trim();
  const linkUrl = `https://modakids.blendibox.com.br/${mybrand}/${produto['slug']}`;
/*
{"slug":"kit-6-pcs-edredom-casa-dona-dupla-face-casal-queen-com-lencol-bege-10630hdu44kpb1",
"$":{"id":"40671926619","lang":""},
"brand":{"brandName":"Casa Dona"},
"cat":{"mCat":"cama"},
"price":{"$":{"curr":"BRL"},
"buynow":"219.99","store":"0.00"},
"text":{"name":"Kit 6 Pçs Edredom Casa Dona Dupla Face Casal Queen com Lençol Bege","desc":""},
"uri":{"awTrack":"https://www.awin1.com/pclick.php?p=40671926619&a=2104315&m=17697",
"alternateImageTwo":"https://static.dafiti.com.br/p/-5569875-3-zoom.jpg",
"awImage":"https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Astatic.dafiti.com.br%2Fp%2F-5569875-1-zoom.jpg&feedId=53091&k=71128f9af06c19cb548f564495f0caa5ec34d9cc",
"mImage":"https://static.dafiti.com.br/p/-5569875-1-zoom.jpg",
"mLink":"https://www.dafiti.com.br/Kit-6-Pcs-Edredom-Casa-Dona-Dupla-Face-Casal-Queen-com-Lencol-Bege-5789655.html"},
"vertical":{"$":{"id":"2","name":"Fashion"}},
"pId":"10630HDU44KPB-1"},
*/
   return (
      <>   
      	 
		 <SchemaProduto
		 suppressHydrationWarning
		   title={produto['text']?.['name']}
		   image={produto['alternateImageTwo'] || produto['awImage'] || produto['mImage']  } 
		   link ={linkUrl || '#'}
		   brand={produto['brand']?.['brandName'] || mybrand} 
		   priceGoogle= {produto['Price']}
		   />
	
      <main id="content" role="main" className="justify-center">
		
      <div className="p-8 max-w-3xl mx-auto  ">
      <h1 className="text-3xl font-bold mb-4">Onde Comprar {produto['text']?.['name']}?</h1>
	   <div className="m-2  items-center gap-4 rounded-lg bg-white p-6 shadow-md outline outline-black/5 dark:bg-gray-800">
		  <Link
			href={produto['uri']?.['awTrack']}
			className="inline-block mt-4  px-4 py-2 rounded"
			title={produto['text']?.['name']}
		  >     

		 <Image
			src={produto['uri']?.['alternateImageTwo'] || produto['uri']?.['awImage'] || produto['uri']?.['mImage'] }
			alt={produto['text']?.['name']}
			width={406}
			height={406}
			className="rounded object-cover w-full h-full"
		  />

	     </Link>
		 <h2> Este produto você encontra na Loja
		  <Link
			href={produto['uri']?.['awTrack']}
			className="inline-block mt-4  px-4 py-2 rounded underline decoration-emerald-500"
			title={'Clique e vá para a loja da Marca ' + produto['brand']?.['brandName']  + ' na ' +   mybrand}
		  >
		 <b>{  produto['brand']?.['brandName'] ||  mybrand }</b>

          </Link>		 
		  </h2>
		 
      <p className="mt-4 text-lg">{ produto['text']?.['desc'] || ""}</p>
	  
	  <Link
			href={produto['uri']?.['awTrack']}
			className="inline-block mt-4  px-4 py-2 rounded"
			title={produto['Title']}
		  >     
		 <Image
			src={produto['uri']?.['alternateImageTwo'] || produto['uri']?.['awImage'] || produto['uri']?.['mImage']}
			alt={produto['text']?.['name']}
			width={250}
			height={250}
			className="rounded "
		  />
	     </Link>
      <p className="mt-2 text-green-700 font-bold">Preço: {produto['price']?.['buynow']}*</p>
      <Link
        href={produto['uri']?.['awTrack']}
        className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded text-xl"
      >
        Comprar  na loja {produto['brand']?.['brandName'] ||  mybrand }
      </Link>
	 
	  <hr className=" mt-12 "/>
	  <p>* Valor na data de publicação - 14/08/2025</p>

	  </div>
    </div>
         
        </main>
      </>
    );
  }
