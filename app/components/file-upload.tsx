import {
  Autocomplete, AutocompleteItem,
  Button, Form, Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Textarea,
  useDisclosure,
} from "@nextui-org/react";
import type {LibGSNIndex} from "~/util/doc-details";
import {useState} from "react";
import {AuthenticityTokenInput} from "remix-utils/csrf/react";
import {useFetcher} from "react-router";

export function FileUploadModal({ index }: { index: LibGSNIndex}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [currentCategory, setCurrentCategory] = useState<string | undefined>()
  const fetcher = useFetcher();
  return (
    <>
      <Button color="primary" onPress={onOpen} className={"font-bold w-full"}>
        Create new upload
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop={"blur"} isDismissable={false}>
        <Form validationBehavior={"native"}
        action={async (e) => {
          await fetcher.submit(e, {
            method: "post",
            encType: "multipart/form-data",
            action: "/science/upload",
            preventScrollReset: true,
          });
        }}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Create new upload</ModalHeader>
                <ModalBody>
                  <input
                    name={"file"}
                    type={"file"} required
                  />
                  <Input
                    isRequired
                    label={"Document name"} name={"name"}
                    placeholder={"Differential Equations"}
                    variant={"bordered"}
                    description={"The name that users see and is searchable."}
                  />
                  <Input
                    isRequired
                    label={"Document code"} name={"code"}
                    placeholder={"9649-N-DE15"}
                    variant={"bordered"}
                    description={"A unique code for a document. May only contain letters and a dash (-)."}
                  />
                  <Input
                    isRequired
                    label={"Document year"} name={"year"}
                    placeholder={"2025"}
                    type={"number"}
                    variant={"bordered"}
                    description={"The year the document should be used. Useful for targeting future syllabi, if there are any changes then."}
                  />
                  <Textarea
                    isRequired
                    label={"Description"} name={"desc"}
                    variant={"bordered"}
                    description={"A short description of what the document contains. Indicate any " +
                      "other documents required."}
                  />
                  <Autocomplete
                    isRequired variant={"bordered"}
                    label={"Category"} name={"category"}
                    isClearable={false}
                    onSelectionChange={(e) => setCurrentCategory(e as string | undefined)}
                    defaultItems={index.categories.map((x) => x.name)
                      .sort()
                      .map((x) => ({name: x}))}>
                    {(x) => <AutocompleteItem key={x.name}>{x.name}</AutocompleteItem>}
                  </Autocomplete>
                  <Autocomplete
                    isRequired variant={"bordered"}
                    label={"Document type"} name={"doctype"}
                    isClearable={false}
                    defaultItems={index.doctype.map((x) => x.name)
                      .sort()
                      .map((x) => ({name: x}))}>
                    {(x) => <AutocompleteItem key={x.name}>{x.name}</AutocompleteItem>}
                  </Autocomplete>
                  <Autocomplete
                    isRequired variant={"bordered"}
                    label={"Subject"} name={"subject"}
                    isClearable={false}
                    listboxProps={{
                      emptyContent: "Select a category!",
                    }}
                    defaultItems={index.categories.filter((x) => x.name === currentCategory)
                      .flatMap((x) => x.subjects)
                      .map((x) => x.name) // have to do this or TS complains
                      .sort()
                      .map((x) => ({
                        name: x,
                      }))}>
                    {(x) => <AutocompleteItem key={x.name}>{x.name}</AutocompleteItem>}
                  </Autocomplete>
                  {fetcher.data && fetcher.data.message != "success" && <p>{fetcher.data.message}</p>}
                  <AuthenticityTokenInput/>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={() => {
                    setCurrentCategory(undefined);
                    onClose();
                  }} className={"font-bold"}>
                    Close
                  </Button>
                  <Button color="primary" type={"submit"} className={"font-bold"}>
                    Upload
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
}

