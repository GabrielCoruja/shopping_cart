import { Outlet, ScrollRestoration } from 'react-router';
import { CartDrawer } from './CartDrawer';
import { Header } from './Header';

export function Layout() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <p className="demo-banner" role="note">
        Projeto de demonstração: nenhum pagamento é processado e nenhum dado sai do seu navegador.
      </p>
      <main id="conteudo" className="container">
        <Outlet />
      </main>
      <CartDrawer />
      <ScrollRestoration />
      <footer className="footer">
        Feito por{' '}
        <a href="https://github.com/GabrielCoruja" target="_blank" rel="noreferrer">Gabriel Dalseco</a>
        {' '}com React, TypeScript e Redux Toolkit
      </footer>
    </>
  );
}
