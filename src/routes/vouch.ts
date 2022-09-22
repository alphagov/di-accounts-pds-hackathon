import express from "express";

import {
  requestVouchGet,
  vouchForSomeoneGet,
  voucheeYourNameGet,
  voucheeProvidePhotoGet,
  voucheeConfirmationGet,
  voucheeVoucherDetailsGet,
  voucheeVoucherDetailsPost,
  voucheeDoneGet,
  voucheeYourNamePost,
  voucheeProvidePhotoPost,
  confirmLikenessGet,
  confirmLikenessPost,
  confirmDetailsGet,
  voucherEndGet,
  useSavedProofOfIdGet,
} from "../controllers/vouch";

const router = express.Router();

router.get("/request-vouch", requestVouchGet);
router.get("/vouch-for-someone", vouchForSomeoneGet);

router.get("/request-vouch/your-name", voucheeYourNameGet);
router.post("/request-vouch/your-name", voucheeYourNamePost);

router.get("/request-vouch/provide-photo", voucheeProvidePhotoGet);
router.post("/request-vouch/provide-photo", voucheeProvidePhotoPost);

router.get("/request-vouch/voucher-details", voucheeVoucherDetailsGet);
router.post("/request-vouch/voucher-details", voucheeVoucherDetailsPost);

router.get("/request-vouch/confirmation", voucheeConfirmationGet);
router.get("/request-vouch/done", voucheeDoneGet);

router.get(
  "/vouch-for-someone/use-saved-proof-of-identity",
  useSavedProofOfIdGet
);
router.get("/vouch-for-someone/confirm-likeness", confirmLikenessGet);
router.post("/vouch-for-someone/confirm-likeness", confirmLikenessPost);
router.get("/vouch-for-someone/confirm-details", confirmDetailsGet);
router.get("/vouch-for-someone/done", voucherEndGet);

export default router;
