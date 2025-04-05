import { UploadRequestResponseDTO } from "@/store/dtos/response/LoginResponseDTO";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { AllRoles, MediaType, UploadRequestStatus } from "@/utils/enums";
import { Button } from "@heroui/button";
import { Check, Pencil, X } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Video } from "reactjs-media";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import AddEditUploadRequest from "./AddEditUploadRequest";
import { useEffect, useRef, useState } from "react";
import { UploadRequestDTO } from "@/store/dtos/request/UploadRequestDTO";
import { updateUploadRequestStatusHandler } from "@/store/controllers/UploadRequestController";
import showToast from "@/utils/showToast";

const UploadRequestCard = ({
  request,
}: {
  request: UploadRequestResponseDTO;
}) => {
  const dispatch = useAppDispatch();
  const [uploadRequest, setUploadRequest] = useState<UploadRequestDTO>({
    description: "",
    media: null,
    mediaType: "",
    mediaUrl: "",
    tags: [],
    title: "",
    uploadRequestStatus: "",
    uploadTo: [],
    uploadTypeMapping: [],
  });
  const user = useAppSelector(selectLoggedInUser);
  const approveUpload = async () => {
    const { message, success } = await updateUploadRequestStatusHandler(
      dispatch,
      UploadRequestStatus.APPROVED,
      request.requestId
    );
    if (success) {
      showToast({ color: "success", title: message });
    } else {
      showToast({ color: "danger", title: message });
    }
  };
  const rejectUpload = async () => {
    const { message, success } = await updateUploadRequestStatusHandler(
      dispatch,
      UploadRequestStatus.DECLINED,
      request.requestId
    );
    if (success) {
      showToast({ color: "success", title: message });
    } else {
      showToast({ color: "danger", title: message });
    }
  };
  const requestRevision = async () => {
    const { message, success } = await updateUploadRequestStatusHandler(
      dispatch,
      UploadRequestStatus.REVISION,
      request.requestId
    );
    if (success) {
      showToast({ color: "success", title: message });
    } else {
      showToast({ color: "danger", title: message });
    }
  };
  const addEditUploadRequestModalRef = useRef();
  const openAddEditUploadRequestModal = () => {
    if (
      addEditUploadRequestModalRef.current &&
      "openModal" in addEditUploadRequestModalRef.current
    ) {
      (
        addEditUploadRequestModalRef.current as { openModal: () => void }
      ).openModal();
    }
  };
  useEffect(() => {
    if (request) {
      setUploadRequest({
        description: request?.description,
        media: null,
        mediaType: request?.mediaType,
        mediaUrl: request?.mediaUrl,
        tags: request?.tags,
        title: request?.title,
        uploadRequestStatus: request?.uploadRequestStatus,
        uploadTo: request?.uploadTo,
        uploadTypeMapping: request?.uploadTypeMapping,
      });
    }
  }, [request]);
  return (
    <>
      <AddEditUploadRequest
        operationType="UPDATE"
        uploadRequestId={request?.requestId}
        ref={addEditUploadRequestModalRef}
        uploadRequest={uploadRequest}
      />
      <Card>
        <CardHeader className="w-full flex flex-col gap-1 items-start">
          <div className="w-full flex justify-between items-center font-bold text-xl">
            {request?.title}
            {user?.userRole === AllRoles.TEAM_MEMBER && (
              <Button
                isIconOnly
                isDisabled={
                  uploadRequest?.uploadRequestStatus ===
                    UploadRequestStatus?.APPROVED ||
                  uploadRequest?.uploadRequestStatus ===
                    UploadRequestStatus?.DECLINED
                }
                size="sm"
                onPress={openAddEditUploadRequestModal}
              >
                <Pencil size={15} />
              </Button>
            )}
          </div>
          <Chip
            className="font-semibold"
            size="sm"
            color={
              request.uploadRequestStatus ===
              UploadRequestStatus.UPLOAD_COMPLETED.toString()
                ? "success"
                : request.uploadRequestStatus ===
                      UploadRequestStatus.DECLINED.toString() ||
                    request.uploadRequestStatus ===
                      UploadRequestStatus.UPLOAD_FAILED.toString()
                  ? "danger"
                  : "warning"
            }
          >
            {request?.uploadRequestStatus}
          </Chip>
        </CardHeader>
        <CardBody className="flex items-center justify-center  flex-col gap-[1rem]">
          {/* COMMON VIEW */}
          <div className="w-[30rem] h-[20rem] ">
            {request?.mediaType === MediaType.IMAGE ? (
              <Image
                isZoomed
                className="object-cover h-[20rem] md:h-[25rem] w-[100%]"
                src={request?.mediaUrl || ""}
                classNames={{
                  wrapper: "width-wrapper",
                }}
              />
            ) : (
              <Video
                src={request?.mediaUrl || ""}
                controls
                width={"100%"}
                height={"100%"}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2 w-full justify-start">
            {request?.tags?.map((tag) => {
              return <Chip key={tag}>{tag}</Chip>;
            })}
          </div>
          <div className="flex w-full justify-start items-center gap-2">
            <Tooltip
              key={"description"}
              className="max-w-[300px] max-h-[200px] break-words  flex flex-wrap"
              color="secondary"
              content={request?.description}
              placement={"bottom"}
            >
              <Button>Description</Button>
            </Tooltip>
            <Tooltip
              key={"uploadTo"}
              className="max-w-[300px] max-h-[200px] break-words overflow-y-auto flex flex-wrap"
              color="secondary"
              content={
                <Table aria-label="Uplod to mapping">
                  <TableHeader>
                    <TableColumn>Platform</TableColumn>
                    <TableColumn>Content Type</TableColumn>
                    <TableColumn>Upload Status</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {request?.uploadTypeMapping?.map((upload) => {
                      return (
                        <TableRow key={upload.platform}>
                          <TableCell>{upload.platform}</TableCell>
                          <TableCell>{upload.contentType}</TableCell>
                          <TableCell>
                            <Chip
                              className="font-semibold"
                              size="sm"
                              color={
                                request.uploadRequestStatus ===
                                UploadRequestStatus.UPLOAD_COMPLETED.toString()
                                  ? "success"
                                  : request.uploadRequestStatus ===
                                        UploadRequestStatus.DECLINED.toString() ||
                                      request.uploadRequestStatus ===
                                        UploadRequestStatus.UPLOAD_FAILED.toString()
                                    ? "danger"
                                    : "warning"
                              }
                            >
                              {upload.status}
                            </Chip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              }
              placement={"bottom"}
            >
              <Button>Upload To</Button>
            </Tooltip>
          </div>
          {/* CONTENT CREATOR VIEW */}
          {user?.userRole === AllRoles.CONTENT_CREATOR && (
            <div className="w-full flex justify-center gap-2">
              <Button
                color="success"
                variant="bordered"
                onPress={approveUpload}
                // isDisabled={
                //   uploadRequest?.uploadRequestStatus !==
                //     UploadRequestStatus?.PENDING &&
                //   uploadRequest?.uploadRequestStatus !==
                //     UploadRequestStatus?.REVISION
                // }
              >
                Approve <Check />
              </Button>
              <Button
                color="warning"
                variant="bordered"
                onPress={requestRevision}
                isDisabled={
                  uploadRequest?.uploadRequestStatus !==
                    UploadRequestStatus?.PENDING &&
                  uploadRequest?.uploadRequestStatus !==
                    UploadRequestStatus?.REVISION
                }
              >
                Revision
              </Button>
              <Button
                color="danger"
                variant="bordered"
                onPress={rejectUpload}
                isDisabled={
                  uploadRequest?.uploadRequestStatus !==
                    UploadRequestStatus?.PENDING &&
                  uploadRequest?.uploadRequestStatus !==
                    UploadRequestStatus?.REVISION
                }
              >
                Decline <X />
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default UploadRequestCard;
