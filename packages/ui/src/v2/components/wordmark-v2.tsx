import { type ComponentProps } from "solid-js"

export function WordmarkV2(props: Pick<ComponentProps<"svg">, "class">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 129"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g opacity="0.6">
        <g opacity="0.16">
          <text
            x="0"
            y="105"
            font-family="'JetBrains Mono', 'Fira Code', 'Source Code Pro', ui-monospace, monospace"
            font-size="110"
            font-weight="800"
            letter-spacing="6"
            fill="currentColor"
          >
            voracode
          </text>
        </g>
      </g>
    </svg>
  )
}
