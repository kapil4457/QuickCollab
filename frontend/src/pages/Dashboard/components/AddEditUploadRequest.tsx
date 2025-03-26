import {
  UploadRequestDTO,
  UploadRequestItem,
} from "@/store/dtos/request/UploadRequestDTO";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Save, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ValidationError } from "@react-types/shared";
import { MediaType, PlatformType } from "@/utils/enums";
import { Label } from "@/components/ui/label";
import { selectUploadRequestMappings } from "@/store/slices/userSlice";
import { Image } from "@heroui/image";
import { Video } from "reactjs-media";

type propsType = {
  operationType: "UPDATE" | "CREATE";
  uploadRequest?: UploadRequestDTO | null;
  uploadRequestId?: string;
};

type FormErrors = {
  title?: string;
  description?: string;
  uploadTo?: string;
  uploadTypeMapping?: string;
  media?: string;
  mediaUrl?: string;
};

const AddEditUploadRequest = forwardRef((props: propsType, ref) => {
  const [uploadRequest, setUploadRequest] = useState<UploadRequestDTO>({
    title: "",
    description: "",
    media: null,
    mediaType: "",
    mediaUrl: "",
    tags: [],
    uploadRequestStatus: "",
    uploadTo: [],
    uploadTypeMapping: null,
  });
  const [uploadRequestId, setUploadRequestId] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();
  const mediaFileRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));
  const uploadRequestMappings = useAppSelector(selectUploadRequestMappings);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadRequest({
        ...uploadRequest,
        media: file,
      });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const createUploadRequest = async () => {};
  const updateUploadRequest = async () => {};
  useEffect(() => {
    if (props?.operationType === "UPDATE") {
      setUploadRequest(props.uploadRequest!);
      setUploadRequestId(props.uploadRequestId!);
    }
  }, [props]);
  return (
    <Modal backdrop="blur" size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.operationType === "CREATE" ? "Create" : "Update"} Upload
              Request
            </ModalHeader>
            <ModalBody>
              <Form
                className="w-full justify-center items-center flex flex-col gap-4 pb-4"
                validationErrors={errors as Record<string, ValidationError>}
                onSubmit={
                  props.operationType === "CREATE"
                    ? createUploadRequest
                    : updateUploadRequest
                }
              >
                <Input
                  isRequired
                  label="Title"
                  labelPlacement="outside"
                  name="title"
                  placeholder="Enter the title."
                  value={uploadRequest?.title}
                  onChange={(e) => {
                    setUploadRequest({
                      ...uploadRequest,
                      title: e.target.value,
                    });
                  }}
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a title";
                    }
                    return errors.title;
                  }}
                />
                <Textarea
                  isRequired
                  label="Description"
                  labelPlacement="outside"
                  name="description"
                  placeholder="Enter the description."
                  value={uploadRequest?.description}
                  onChange={(e) => {
                    setUploadRequest({
                      ...uploadRequest,
                      description: e.target.value,
                    });
                  }}
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a description";
                    }
                    return errors.description;
                  }}
                />
                <Select
                  label="Upload to"
                  placeholder="Select a platform"
                  name="uploadTo"
                  labelPlacement="outside"
                  isRequired
                  selectionMode="multiple"
                  value={uploadRequest?.uploadTo}
                  selectedKeys={uploadRequest?.uploadTo}
                  onSelectionChange={(e) => {
                    const selectedValues = Array.from(e, (option) =>
                      option.toString()
                    );
                    if (uploadRequest?.uploadTypeMapping) {
                      let newMap: UploadRequestItem[] = [];
                      for (let value of selectedValues) {
                        newMap.push({
                          platform: value,
                          contentType:
                            uploadRequest?.uploadTypeMapping.find(
                              (ele) => ele.platform === value
                            )?.contentType || "",
                        });
                      }
                      setUploadRequest({
                        ...uploadRequest,
                        uploadTypeMapping: newMap,
                      });
                    }
                    setUploadRequest({
                      ...uploadRequest,
                      uploadTo: selectedValues,
                    });
                  }}
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please select platforms to upload to";
                    }
                    return errors.uploadTo;
                  }}
                >
                  {Object.keys(PlatformType).map((platform) => (
                    <SelectItem key={platform}>{platform}</SelectItem>
                  ))}
                </Select>

                {uploadRequest?.uploadTo?.length != 0 && (
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Platform Mapping</Label>
                    {uploadRequest?.uploadTo?.map((platform) => (
                      <div className="flex gap-2">
                        <Button isDisabled>{platform}</Button>
                        <Select
                          placeholder="Select media type"
                          name={`uploadTypeMapping-${platform}`}
                          labelPlacement="outside"
                          isRequired
                          value={
                            uploadRequest?.uploadTypeMapping?.find(
                              (ele) => ele.platform === platform
                            )?.contentType || ""
                          }
                          onSelectionChange={(e) => {
                            const newMap: UploadRequestItem[] =
                              uploadRequest?.uploadTypeMapping?.filter(
                                (ele) => ele.platform !== platform
                              ) || [];
                            newMap.push({
                              platform: platform,
                              contentType: e.currentKey || "",
                            });
                            setUploadRequest({
                              ...uploadRequest,
                              uploadTypeMapping: newMap,
                            });
                          }}
                          errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                              return "Please select platforms mapping";
                            }
                            return errors.uploadTypeMapping;
                          }}
                        >
                          {(
                            uploadRequestMappings.find(
                              (ele) => ele.platform === platform
                            )?.contentTypes || []
                          ).map((ele) => (
                            <SelectItem key={ele}>{ele}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    ))}
                  </div>
                )}

                <div className="w-full flex flex-col gap-2 justify-center items-center">
                  <Input
                    id="fileHandle"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    ref={mediaFileRef}
                  />
                  {uploadRequest?.media && (
                    <div className="w-full flex flex-wrap justify-start items-center">
                      <span className="relative">
                        {uploadRequest?.media?.type.includes("image") ? (
                          <Image
                            src={previewUrl || ""}
                            height={50}
                            width={50}
                          />
                        ) : (
                          <Video
                            src={previewUrl || ""}
                            height={50}
                            width={50}
                          />
                        )}
                        <X
                          className="absolute top-[4px] right-[4px] z-10 text-black h-[10px] w-[10px] bg-white rounded-full cursor-pointer"
                          onClick={() => {
                            setPreviewUrl("");
                            if (mediaFileRef && mediaFileRef.current) {
                              mediaFileRef.current.value = "";
                            }
                            setUploadRequest({
                              ...uploadRequest,
                              media: null,
                            });
                          }}
                        />
                      </span>
                    </div>
                  )}
                </div>
                <Button className="w-full" color="primary" type="submit">
                  <Save />
                  {props?.operationType === "CREATE" ? "Create" : "Save"}
                </Button>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default AddEditUploadRequest;
