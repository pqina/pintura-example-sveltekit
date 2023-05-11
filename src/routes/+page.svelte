<script>
  // svelte filepond
  import FilePond from "svelte-filepond";
  import { registerPlugin } from "filepond";
  import FilePondPluginFilePoster from "filepond-plugin-file-poster";
  import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";
  import "filepond/dist/filepond.min.css";
  import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";

  // svelte pintura
  import {
    PinturaEditor,
    PinturaEditorModal,
    PinturaEditorOverlay,
  } from "@pqina/svelte-pintura";

  // pintura
  import "@pqina/pintura/pintura.css";
  import {
    LocaleCore,
    LocaleCrop,
    LocaleAnnotate,
    LocaleFilter,
    LocaleFinetune,
    LocaleMarkupEditor,
  } from "@pqina/pintura/locale/en_GB";

  import {
    // editor
    createDefaultImageReader,
    createDefaultImageWriter,
    createDefaultShapePreprocessor,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_finetune,
    plugin_finetune_defaults,
    plugin_filter,
    plugin_filter_defaults,
    plugin_annotate,
    markup_editor_defaults,

    // filepond
    openEditor,
    processImage,
    createDefaultImageOrienter,
    legacyDataToImageState,
  } from "@pqina/pintura";

  // FilePond
  registerPlugin(FilePondPluginFilePoster, FilePondPluginImageEditor);

  // Pintura
  setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

  const editorDefaults = {
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    shapePreprocessor: createDefaultShapePreprocessor(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
      ...LocaleCore,
      ...LocaleCrop,
      ...LocaleAnnotate,
      ...LocaleFilter,
      ...LocaleFinetune,
      ...LocaleMarkupEditor,
    },
  };

  /**
   * @type { string }
   */
  let inlineResult;

  /**
   * @type { string }
   */
  let modalResult;
  let modalVisible = false;

  // overlay
  let overlayVisible = false;

  /**
   * @type { string }
   */
  let overlayResult;

  /**
   * @type { any }
   */
  let overlayImageState;
</script>

<main>
  <h1>Pintura Image Editor</h1>

  <h2>Inline</h2>

  <div style="height:70vh">
    <PinturaEditor
      {...editorDefaults}
      on:load={(e) => console.log("inline load", e.detail)}
      on:process={(e) => (inlineResult = URL.createObjectURL(e.detail.dest))}
      src="image.jpeg"
    />
  </div>

  {#if inlineResult}
    <p>
      <img src={inlineResult} alt="" />
    </p>
  {/if}

  <h2>Modal</h2>

  <p>
    <button on:click={() => (modalVisible = true)}>Open editor</button>
  </p>

  {#if modalVisible}
    <PinturaEditorModal
      {...editorDefaults}
      on:hide={(e) => (modalVisible = false)}
      on:load={(e) => console.log("modal load", e.detail)}
      on:process={(e) => (modalResult = URL.createObjectURL(e.detail.dest))}
      src="image.jpeg"
    />
  {/if}

  {#if modalResult}
    <p>
      <img src={modalResult} alt="" />
    </p>
  {/if}

  <h2>Overlay</h2>

  <p>
    {#if !overlayVisible}
      <button on:click={() => (overlayVisible = true)}>Edit image</button>
    {:else}
      <button on:click={() => (overlayVisible = false)}>Close editor</button>
    {/if}
  </p>

  {#if !overlayVisible}
    <p>
      <img
        width="512"
        height="256"
        src={overlayResult || "image.jpeg"}
        alt=""
      />
    </p>
  {:else}
    <div style="width:512px; height:256px;">
      <PinturaEditorOverlay
        {...editorDefaults}
        on:load={(e) => console.log("overlay load", e.detail)}
        on:process={(e) => {
          overlayImageState = e.detail.imageState;
          overlayResult = URL.createObjectURL(e.detail.dest);
          overlayVisible = false;
        }}
        src="image.jpeg"
        imageState={overlayImageState}
      />
    </div>
  {/if}

  <h2>FilePond</h2>

  <div style="max-width: 20em; padding-bottom: 2em;">
    <FilePond
      server="/api"
      allowMultiple={true}
      imageEditor={{
        // map legacy data objects to new imageState objects
        legacyDataToImageState: legacyDataToImageState,

        // used to create the editor, receives editor configuration, should return an editor instance
        createEditor: openEditor,

        // Required, used for reading the image data
        imageReader: [
          createDefaultImageReader,
          {
            /* optional image reader options here */
          },
        ],

        // optionally. can leave out when not generating a preview thumbnail and/or output image
        imageWriter: [
          createDefaultImageWriter,
          {
            /* optional image writer options here */
          },
        ],

        // used to generate poster images, runs an editor in the background
        imageProcessor: processImage,

        // editor options
        editorOptions: {
          imageOrienter: createDefaultImageOrienter(),
          ...plugin_finetune_defaults,
          ...plugin_filter_defaults,
          ...markup_editor_defaults,
          locale: {
            ...LocaleCore,
            ...LocaleCrop,
            ...LocaleAnnotate,
            ...LocaleFilter,
            ...LocaleFinetune,
            ...LocaleMarkupEditor,
          },
        },
      }}
    />
  </div>
</main>

<style global>
  img {
    max-width: 100%;
  }
</style>
