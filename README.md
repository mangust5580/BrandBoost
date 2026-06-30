# BrandBoost

[![Deploy GitHub Pages](https://github.com/mangust5580/BrandBoost/actions/workflows/deploy.yml/badge.svg)](https://github.com/mangust5580/BrandBoost/actions/workflows/deploy.yml)
[![License](https://img.shields.io/github/license/mangust5580/BrandBoost)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)
[![Live demo](https://img.shields.io/badge/live-demo-2ea44f)](https://mangust5580.github.io/BrandBoost/)

BrandBoost — портфолио-проект в формате лендинга для вымышленного digital-маркетингового агентства. Проект сделан как витринная работа: он показывает семантическую HTML-разметку, SCSS-архитектуру, адаптивные изображения, базовую доступность, SEO-метаданные и production-oriented сборку статического сайта.

Контент, контакты, юридические страницы и сценарий формы являются демонстрационными. В контактах используются зарезервированные `.example`-адреса. Форма не отправляет и не сохраняет данные: она валидирует поля и переводит пользователя на демо-страницу подтверждения.

## Состав проекта

- Главная страница с hero-блоком, услугами, описанием компании, превью блога и контактной формой.
- Страница статьи блога.
- Страницы политики конфиденциальности и пользовательского соглашения.
- Демо-страница благодарности с `noindex`.
- Адаптивная верстка от 320px.
- Оптимизация под Lighthouse: Performance, Accessibility, Best Practices и SEO.

## Quality checks

- Lighthouse Performance: 100
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- `npm run check` passes

## Сборка

Проект использует локально обновленную версию кастомной Gulp 5 сборки на базе [gulp-lonrav](https://github.com/mangust5580/gulp-lonrav).

Публичный репозиторий `gulp-lonrav` сейчас содержит более старую версию. Реализация сборки внутри этого проекта новее; в дальнейшем ее планируется синхронизировать обратно в репозиторий сборки.

## Стек

- HTML-шаблоны с includes.
- SCSS с компонентной структурой в стиле БЭМ.
- CSS custom properties для дизайн-токенов.
- Fluid-типографика и helpers для адаптивных размеров.
- Vanilla JavaScript-модули, собираемые через esbuild.
- Gulp 5 pipeline.
- Оптимизация изображений и генерация responsive AVIF/WebP/JPG/PNG.
- Оптимизация SVG и генерация SVG-спрайта.
- ESLint, Stylelint, Prettier.

## Требования

Node.js `>=20`.

## Команды

```bash
npm ci
npm run dev
npm run build
npm run preview
npm run check
```

`npm run dev` запускает dev-сервер в watch-режиме.  
`npm run build` создает production-сборку в `public/`.  
`npm run preview` локально поднимает production-сборку.  
`npm run check` запускает линтеры и полную production-сборку.

## Структура

```text
src/
  assets/      Изображения, иконки, шрифты, Open Graph изображение
  pages/       HTML-страницы верхнего уровня
  scripts/     JavaScript config, modules и utilities
  shared/      Переиспользуемые HTML-шаблоны
  styles/      SCSS core, helpers, layouts, components, sections, pages

config/        Конфигурация проекта и сборки
gulp/          Реализация Gulp-задач
public/        Production-сборка
dist/          Development-сборка
```

## Архитектурные заметки

- Разметка использует БЭМ-подход; утилитарные классы применяются только для переиспользуемых сущностей вроде `container`, `section` и `visually-hidden`.
- JavaScript-модули используют общие селекторы и state-константы из `src/scripts/config/`.
- SCSS разделен на токены, layout-примитивы, компоненты, секции и стили отдельных страниц.
- Responsive-ширины изображений по возможности генерируются из фактического использования в разметке, без лишних вариантов.
- Генератор sitemap исключает страницы, у которых в `meta robots` указан `noindex`.

## License

MIT License. See [LICENSE](LICENSE).

## Production

Проект готов для статического хостинга, например GitHub Pages. Для реального коммерческого сайта нужно заменить демо-контакты, внешние ссылки, юридический текст и обработку формы на production-данные и backend-интеграцию.

Для деплоя на GitHub Pages сборку нужно выполнять с корректными site URL и base path, чтобы canonical, Open Graph URL и sitemap указывали на опубликованный адрес.

The deploy workflow runs `npm ci` and `npm run check`, then uploads `public/` through the official GitHub Pages artifact flow. CI sets `SITE_URL=https://mangust5580.github.io` and `SITE_BASE_PATH=/BrandBoost`.
