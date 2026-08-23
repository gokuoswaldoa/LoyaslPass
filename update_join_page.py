import codecs
import re

with codecs.open("src/app/[businessId]/join/page.tsx", "r", "utf-8") as f:
    text = f.read()

# Add useSearchParams
text = text.replace('import { useParams, useRouter } from "next/navigation";', 'import { useParams, useRouter, useSearchParams } from "next/navigation";')

# Import getCustomerNameById
text = text.replace('import { getBusinessOnboardingData, registerCustomer } from "@/app/actions/clientFlow";', 'import { getBusinessOnboardingData, registerCustomer, getCustomerNameById } from "@/app/actions/clientFlow";')

# Add search params and ref handling
old_init = """export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null);"""

new_init = """export default function JoinPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const refId = searchParams.get("ref");

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);"""

text = text.replace(old_init, new_init)

# Add loadData for ref
old_loaddata = """      const res = await getBusinessOnboardingData(businessId);
      if (res.success) {
        setBusinessData(res.business);
        setConfig(res.config);
      } else {"""

new_loaddata = """      const res = await getBusinessOnboardingData(businessId);
      if (res.success) {
        setBusinessData(res.business);
        setConfig(res.config);
        if (refId) {
           const refName = await getCustomerNameById(refId);
           setReferrerName(refName);
        }
      } else {"""

text = text.replace(old_loaddata, new_loaddata)

# Pass refId to registerCustomer
text = text.replace('const res = await registerCustomer(businessId, name, phone, email, birthdate);', 'const res = await registerCustomer(businessId, name, phone, email, birthdate, refId);')

# Update UI for referred
old_ui = """          <h1 className="text-3xl font-black text-white drop-shadow-sm leading-tight mb-2">
            Únete a {businessData.name}
          </h1>
          <p className="text-white/80 font-medium">
            Regístrate rápido y obtén tu {config.rewardText || "recompensa gratis"} al completar {config.totalStampsRequired} sellos.
          </p>"""

new_ui = """          <h1 className="text-3xl font-black text-white drop-shadow-sm leading-tight mb-2">
            {referrerName ? `¡${referrerName} te invitó!` : `Únete a ${businessData.name}`}
          </h1>
          <p className="text-white/80 font-medium">
            {referrerName 
              ? `Regístrate y en tu primera visita a ${businessData.name} ganarás 2 sellos automáticos.`
              : `Regístrate rápido y obtén tu ${config.rewardText || "recompensa gratis"} al completar ${config.totalStampsRequired} sellos.`}
          </p>"""

text = text.replace(old_ui, new_ui)

with codecs.open("src/app/[businessId]/join/page.tsx", "w", "utf-8") as f:
    f.write(text)
