import {
  $,
  component$,
  useClientEffect$,
  useStore,
  SSRStream,
} from '@builder.io/qwik';
import ComponentA from '~/components/component-a';
import ComponentB from '~/components/component-b';
import ComponentC from '~/components/component-c';
import { Readable } from "stream";

export default component$(() => {
  const tree = useStore(
    [
      { tag: '~/components/component-a', type: 1 },
      { tag: '~/components/component-a', type: 1 },
      { tag: 'div', type: 0, class: 'bg-green-400', content: 'Hello' },
    ],
    {
      recursive: true,
    }
  );

  const changeComponent = $(() => {
    tree[0].tag = 'ComponentC';
  });

  useClientEffect$(() => {
    // @ts-ignore
    window.changeComponent = changeComponent;
  });

  const components: Record<string, any> = {
    ComponentA: ComponentA,
    ComponentB: ComponentB,
    ComponentC: ComponentC,
  };

  const fetchFragment = async function (
    env?: Record<string, unknown>,
    fragmentName?: string,
    request?: Request
  ) {
    const service = 'filter';

    const response = await fetch(
      'https://qwik-multi-worker-header.devdash.workers.dev'
    );
    if (response.body === null) {
      throw new Error(`Response from "${fragmentName}" request is null.`);
    }
    return response.body;
  };

  const decoder = new TextDecoder();

  return (
    <>
      <div>
        <div>
          {tree.map(async (element) => {
            if (element.type === 0) {
              const Tag = element.tag as any;
              return <Tag class={element.class}>{element.content}</Tag>;
            }

            /*if (element.type === 1) {
              const c = await import('@/components/' + 'component-a');
              return <c.default key={element.tag} />;
            }*/
          })}
        </div>

        <SSRStream>
          {async (stream) => {
            const res = await fetch('https://qwik-multi-worker-header.devdash.workers.dev');
            const reader = res.body as any as Readable;
            reader.setEncoding("utf8");

            // Readable streams emit 'data' events once a listener is added.
            reader.on("data", (chunk) => {
              chunk = String(chunk).replace(
                'q:base="/build/"',
                `q:base="/container/build/header/"`
              );
              stream.write(chunk);
            });

            return new Promise((resolve) => {
              reader.on("end", () => resolve());
            });
          }}
        </SSRStream>

        <button onMouseDown$={changeComponent}>Click me</button>
      </div>
    </>
  );
});
