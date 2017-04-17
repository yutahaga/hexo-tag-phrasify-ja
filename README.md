# hexo-tag-phrasify-ja
形態素解析によって日本語の文章を文節に分けて、各文節をタグで囲う [Hexo](https://hexo.io) タグプラグインです。

出力されたタグに CSS で `display: inline-block` を指定することで文節ごとに改行されるようになり、文章が読みやすくなります。

[goo ラボの形態素解析 API](https://labs.goo.ne.jp/api/jp/morphological-analysis/) を使用しています。

## インストール

```sh
$ npm install hexo-tag-phrasify-ja --save
```

## 設定

gooラボAPIの利用に必要なアプリケーションIDを取得し、`_config.yml`に記述してください。

アプリケーション ID の取得方法は [goo ラボ API 利用方法](https://labs.goo.ne.jp/apiusage/) を参考。

```yaml
phrasify:
  goo_app_id: アプリケーションID
  tag: span
  class: phrase
  cache: .cache.phrasify.json
  alias: type
```

## 使い方

```
{% phrasify %}
あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
{% endphrasify %}

# alias を設定すると 👇 のようにお好きなタグ名で使用できます

{% type %}
あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
{% endtype %}
```

### 出力

```html
<span class="phrase">あの</span><span class="phrase">イーハトーヴォの</span><span class="phrase">すきとおった</span><span class="phrase">風、</span><span class="phrase">夏でも</span><span class="phrase">底に</span><span class="phrase">冷たさを</span><span class="phrase">もつ</span><span class="phrase">青い</span><span class="phrase">そら、</span><span class="phrase">うつくしい</span><span class="phrase">森で</span><span class="phrase">飾られた</span><span class="phrase">モリーオ市、</span><span class="phrase">郊外の</span><span class="phrase">ぎらぎらひかる</span><span class="phrase">草の</span><span class="phrase">波。</span>
```

## キャッシュ
出力結果をキャッシュし、API へのリクエスト要求を減らすようにしています。

`_config.yml` の `phrasify.cache` に設定してあるファイルに保存されます。


## スペシャルサンクス

<a href="http://www.goo.ne.jp/"><img src="https://u.xgoo.jp/img/sgoo.png" alt="supported by goo"
title="supported by goo" width="200"></a>
