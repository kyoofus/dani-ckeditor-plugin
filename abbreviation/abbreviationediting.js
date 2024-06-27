/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "ckeditor5";
import AbbreviationCommand from "./abbreviationcommand";

/**
 * 편집을 담당합니다.
 */
export default class AbbreviationEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add(
      "addAbbreviation",
      new AbbreviationCommand(this.editor)
    );
  }
  /** 모델의 스키마를 확장합니다.  */
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the abbreviation attribute.
    // text node의 스키마를 확장하여 약어 속성을 허용합니다.
    // 모델에서(in the model),  <abbr>과 같은 인라인 요소들은 별개의 요소가 아닌 속성으로 표현됩니다.
    // view에서는 <abbr title="What You See Is Wath You Get">WYSIWYG</abbr>와 같이 표현됩니다.
    schema.extend("$text", {
      allowAttributes: ["abbreviation"],
    });
  }

  /** 변환기를 정의합니다.  */
  _defineConverters() {
    // 변환기(Converters)는 뷰(View)를 모델(Model)로 변환하는 방법(예: 데이터를 편집기에 로드하거나 붙여넣은 콘텐츠를 처리할 때)과 모델을 뷰에 렌더링하는 방법(편집 목적으로 또는 편집기 데이터를 검색할 때)을 편집기에 알려줍니다.
    const conversion = this.editor.conversion;

    // Conversion from a model attribute to a view element
    // 모델 속성을 뷰 요소로 변환합니다.
    // attributeToElement()를 사용하여 모델 약어 속성(the model abbreviation attribute)을 뷰 약어 요소(the view <abbr> element)로 변환합니다.
    conversion.for("downcast").attributeToElement({
      model: "abbreviation",

      // Callback function provides access to the model attribute value
      // and the DowncastWriter
      // 콜백 함수는 모델 속성 값과 DowncastWriter에 대한 액세스를 제공합니다.
      view: (modelAttributeValue, conversionApi) => {
        const { writer } = conversionApi;

        console.log(modelAttributeValue);

        return writer.createAttributeElement("abbr", {
          title: modelAttributeValue,
        });
      },
    });

    // Conversion from a view element to a model attribute
    // 뷰 요소를 모델 속성으로 변환합니다.
    // 업캐스트 변환은 뷰 abbr 요소가 모델에서 어떻게 보이는지 편집기에 알려줍니다
    conversion.for("upcast").elementToAttribute({
      view: {
        name: "abbr",
        attributes: ["title"],
      },
      model: {
        key: "abbreviation",

        // Callback function provides access to the view element
        value: (viewElement) => {
          const title = viewElement.getAttribute("title");
          return title;
        },
      },
    });
  }
}
