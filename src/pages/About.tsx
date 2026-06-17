import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <main className="py-8 md:py-16">
      {/* Hero Story Section */}
      <section className="relative px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          {/* Large Editorial Image */}
          <div className="md:col-span-7 order-2 md:order-1 relative" id="about-images">
            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden soft-bloom-shadow rounded-sm bg-surface-container shine-container">
              <img
                className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-1000"
                alt="Everlasting bouquet detail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQbgBWr1ftUNrZGLaIsDtMeEA7q8XYBPXM_7szgiY2cUQg8Kd4eAz2DUogjBBcIV3oJGAy7Ht-79CAX61gvo47zdF222OFYmkSMIoNBNV5g0c6-gU2lXusnVLnG92YkMo_gF_vPXPuMfqxBmsu8Tw-EaY5SB5SgfEArB_dq17CuQNvw4wL0cuiiNmR3Exp3QZEcuIYOamHAnYG-RIgvPghB_bkCA6neiyFC6YRcrd_zX9CTILTTFpXb7YOZ6cMyp4i8l9cSHFxqf4"
              />
            </div>
            {/* Small Float image */}
            <div className="absolute -bottom-10 -right-6 hidden lg:block w-56 aspect-square soft-bloom-shadow rounded-sm z-10 border-[12px] border-surface overflow-hidden bg-surface-container shine-container">
              <img
                className="w-full h-full object-cover"
                alt="Artisan hands arranging silk peony"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNHszU_J019wh6RozfBiXQ9jshrHQtMl_Xip_CckbvqpD3harI0Zx6hC0BpAbvpLPM_1APpRKbE5n7QV5G5qtHVSUMSYeN5yTOvpMS40kQgSgM_ZSmRHltUnYf6Nj4pVicHM_jFmHbUzQwszkoeq6x8OA6uf79tohs3EXN0pV13tZithS4h6eG_czA9aLVk-U8W-W2lRaKlN8wvyxp6EWMbIzLIpwEz_phIjRWc41zHHPJSJkPvgg65pgKO6JcH3sxUvMDx-fztHU"
              />
            </div>
          </div>
          {/* Text Content */}
          <div className="md:col-span-5 order-1 md:order-2 flex flex-col gap-6 md:pl-8 lg:pl-12 py-8 md:py-0" id="about-text">
            <div className="flex items-center gap-2 text-primary">
              <span className="botanical-divider flex-grow max-w-[40px]"></span>
              <span className="font-label-caps text-xs tracking-widest uppercase font-bold">Tentang Kami</span>
            </div>
            <h1 className="font-display-lg text-4xl md:text-[56px] text-on-surface leading-tight font-semibold">
              Mekar Abadi <br />
              <span className="italic font-normal">Sejak 2024</span>
            </h1>
            <div className="flex flex-col gap-4 text-on-surface-variant leading-relaxed">
              <p className="font-body-lg text-lg">
                Lahir dari kecintaan pada alam dan keinginan akan keabadian. Buket kami berkelanjutan, bebas serbuk sari, dan sempurna untuk momen terbesar dalam hidup—mulai dari pernikahan hingga dekorasi rumah.
              </p>
              <p className="font-body-md text-sm text-on-surface-variant/80">
                Berbasis di Tangerang, Naya Florist percaya bahwa keindahan bunga tidak seharusnya berlalu begitu saja. Kami berspesialisasi dalam rangkaian sutra artisan dan bunga kering yang mempertahankan kilau dan bentuknya tanpa batas waktu.
              </p>
            </div>
            <div className="pt-4 flex">
              <Link
                to="/collections"
                className="px-8 py-3.5 bg-primary text-on-primary border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 font-label-caps text-xs uppercase tracking-widest font-bold rounded"
              >
                Jelajahi Koleksi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="px-margin-mobile md:px-margin-desktop py-16 max-w-screen-2xl mx-auto">
        <div className="botanical-divider"></div>
      </div>

      {/* Philosophical Bento Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter lg:gap-8">
          {/* Item 1 */}
          <div className="bg-surface-container-low border border-outline-variant/10 p-8 flex flex-col items-center text-center gap-4 rounded-lg soft-bloom-shadow">
            <span className="material-symbols-outlined text-primary text-4xl">eco</span>
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">Jiwa Berkelanjutan</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Mengurangi limbah melalui bahan berkualitas tinggi yang tahan lama, musim demi musim.
            </p>
          </div>
          {/* Item 2 */}
          <div className="bg-primary-container/10 border border-primary-container/20 p-8 flex flex-col items-center text-center gap-4 rounded-lg soft-bloom-shadow">
            <span className="material-symbols-outlined text-primary text-4xl">brush</span>
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">Dirangkai dengan Tangan</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Setiap buket dikurasi oleh arsitek bunga kami untuk memastikan keseimbangan warna dan siluet yang sempurna.
            </p>
          </div>
          {/* Item 3 */}
          <div className="bg-surface-container-low border border-outline-variant/10 p-8 flex flex-col items-center text-center gap-4 rounded-lg soft-bloom-shadow">
            <span className="material-symbols-outlined text-primary text-4xl">all_inclusive</span>
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">Keindahan Abadi</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Bebas perawatan, bebas serbuk sari, dan ramah alergen. Keindahan yang tidak pernah pudar atau layu.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-surface-container-highest/20 border-y border-outline-variant/10 py-24 px-margin-mobile mt-16 md:mt-24">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <span className="material-symbols-outlined text-primary/30 text-5xl">format_quote</span>
          <p className="font-headline-md text-2xl md:text-3xl text-primary italic leading-snug">
            "Bunga adalah musik dari bumi. Diucapkan tanpa suara dari bibir bumi. Kami hanya membuat musik itu terus mengalun selamanya."
          </p>
          <div className="botanical-divider max-w-[100px] mx-auto mt-4"></div>
          <p className="font-label-caps text-xs text-on-surface-variant tracking-wider uppercase font-semibold">
            Filosofi Naya
          </p>
        </div>
      </section>
    </main>
  );
};
export default About;
