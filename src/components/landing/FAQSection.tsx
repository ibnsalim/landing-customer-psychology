import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "এই বইটা কার জন্য?",
    a: "যে কেউ ছোট বা মাঝারি ব্যবসা পরিচালনা করেন, কনটেন্ট তৈরি করেন, বা মার্কেটিং করেন — কিন্তু সেলস নিয়ে হতাশ — তাদের জন্য এই বই।",
  },
  {
    q: "এই বইটি কি আমার ব্যবসায় সত্যিই সাহায্য করবে?",
    a: "যদি আপনি প্রচুর মার্কেটিং করেও সেলস পাচ্ছেন না, অথবা ভুল কাস্টমারের পেছনে সময় নষ্ট হচ্ছে — তাহলে হ্যাঁ, এই বইটি আপনার জন্য।",
  },
  {
    q: "এই বইটির দাম একটু বেশি মনে হচ্ছে",
    a: "এক কাপ চায়ের দামে কাস্টমারের মনটা পড়ুন। ৳২৭৯ আপনাকে দেবে এমন এক দৃষ্টিভঙ্গি — যেটা প্র্যাকটিস করলে পরের বছর থেকে ইনশাল্লাহ কয়েকগুণ বেশি বিক্রি করতে পারবেন।",
  },
  {
    q: "পেমেন্টের পর বইটি কীভাবে পাব?",
    a: "অর্ডার কনফার্ম হওয়ার পর সর্বোচ্চ ১২ ঘণ্টার মধ্যে আপনার ইমেইলে ডাউনলোড লিঙ্ক পাঠানো হবে।",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-section-alt">
      <div className="container max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          সচরাচর <span className="text-primary">প্রশ্ন</span>
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-primary/10">
              <AccordionTrigger className="text-left text-base hover:no-underline text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
