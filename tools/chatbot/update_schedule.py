import openpyxl,re,json,collections
import sys
if len(sys.argv)<3: sys.exit('Usage: python3 update_schedule.py schedule.xlsx bhy-chatbot.js [YYYY-MM]')
wb=openpyxl.load_workbook(sys.argv[1])
ws=wb.active
SP={'CARDIOLOGIST':'cardio','CHEST SPECIALIST':'chest','CLNICAL PSYCHOLOGIST':'clinpsy','DERMATOLOGIST':'derm','DIABETOLOGIST/ENDOCRINOLOGIST':'diab','DENTAL SURGEON':'dental','DENTAL & MAXILLOFACIAL SURGEON':'maxfac','ENT SURGEON':'ent','GASTROENTEROLOGIST':'gastro','GENERAL & LAPAROSCOPIC SURGEON':'gensurg','GENERAL PHYSICIAN':'genphys','GYNAECOLOGIST':'gynae','NEPHROLOGIST':'nephro','NEURO PHYSICIAN':'neurophys','NEURO SURGEON':'neurosurg','OPTHALMOLOGIST (EYE SPECIALIST)':'eye','ORTHOPAEDIC SURGEON':'ortho','PSYCHIATRIST':'psychiatrist','PAEDIATRIC SURGEON':'paedsurg','PAEDIATRICIAN':'paeds','PLASTIC SURGEON':'plastic','RHEUMATOLOGY & GENERAL MEDICINE':'rheum','SONOLOGIST':'sono','UROLOGIST':'uro','NUTRITIONIST':'nutri','FAMILY PHYSICIAN':'family','VASCULAR SURGEON':'vascular'}
ORDER=[1,2,3,4,5,6,0]
def pdays(s):
    u=s.upper();fl=''
    if 'PRE' in u: fl+='p'
    if 'ALTERNATE' in u: fl+='a'
    u=u.replace('PRE-APPOINTMENT','').replace('ALTERNATE','')
    D={'MON':1,'TUE':2,'WED':3,'THU':4,'FRI':5,'SAT':6,'SUN':0}
    it=[]
    for m in re.finditer(r'(MON|TUE|WED|THU|FRI|SAT|SUN)[A-Z]*|\bTO\b',u):
        it.append(D[m.group(1)] if m.group(1) else 'TO')
    out=[];i=0
    while i<len(it):
        if it[i]=='TO': i+=1;continue
        if i+2<len(it) and it[i+1]=='TO':
            a,b=ORDER.index(it[i]),ORDER.index(it[i+2]);out+=ORDER[a:b+1];i+=3
        else: out.append(it[i]);i+=1
    return ''.join(str(d) for d in sorted(set(out),key=ORDER.index)),fl
def ptime(s):
    note=''
    m=re.search(r'\((.*?)\)',s)
    if m: note=m.group(1).title().replace('Er ','ER ').replace('Opd','OPD'); 
    note=note.replace('Er Department','ER Department')
    raw=re.sub(r'\s+',' ',re.sub(r'\(.*?\)','',s)).strip()
    mm=re.findall(r'(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?',raw.upper())[:2]
    (h1,m1,a1),(h2,m2,a2)=mm
    def c(h,m,a):
        h=int(h)%12; 
        return h*60+int(m or 0)+(720 if a=='PM' else 0)
    amb=not(a1 and a2)
    s0=c(h1,m1,a1 or 'AM');e0=c(h2,m2,a2 or 'AM')
    if e0==0: e0=1440
    if not amb:
        if e0<=s0: amb=True
        if e0>1320 and 'ER' not in note.upper(): amb=True
    f=lambda x:'%02d:%02d %s'%((x//60)%12 or 12,x%60,'AM' if (x%1440)<720 else 'PM')
    disp=raw if amb else f(s0)+' – '+f(e0)
    return disp,(-1 if amb else s0),(-1 if amb else e0),amb,note
def name(n):
    n=re.sub(r'\s+',' ',n.strip()); u=n.upper()
    u=re.sub(r'^(DR|MS)\.?\s*',lambda m:m.group(1).title()+'. ',u)
    pre=''
    mm=re.match(r'^(Dr|Ms)\. (.*)',u)
    if mm: pre,u=mm.group(1)+'. ',mm.group(2)
    u=' '.join(w.title() if len(w)>2 or not w.endswith('.') else w for w in u.split(' '))
    return (pre+u).replace('Capt ®','Capt (Retd)')
docs=[];cur=None;sec=None;specs=[];flags=collections.defaultdict(list)
svc=next((r for r in range(1,ws.max_row+1) if str(ws.cell(r,1).value).strip().upper()=='SERVICES'),ws.max_row+1)
for r in range(2,svc):
    A,B,C,D,E=[ws.cell(r,c).value for c in range(1,6)]
    if isinstance(A,str) and B is None and A.strip().upper()!='C.N' and C is None:
        sec=SP[A.strip().upper()]
        if sec not in specs: specs.append(sec)
        continue
    if isinstance(B,str) and B.strip().upper()=='CONSULTANT NAME': continue
    if B is None and C is None and D is None: continue
    fee=re.sub(r'PKR\s*','',str(E)).strip() if E else ''
    if B:
        cur={'n':name(B),'s':sec,'x':[],'cn':A,'row':r}; docs.append(cur)
    inh=False
    if C is None: C=ws.cell(r-1,3).value; inh=True
    days,fl=pdays(C)
    t,s0,e0,amb,note=ptime(D)
    if amb: fl+='x'
    if inh: fl+='i'
    cur['x'].append([days,t,s0,e0,fee,fl,note])
    if amb: flags['amb'].append((cur['n'],t))
    if 'a' in fl: flags['alt'].append(cur['n'])
    if inh: flags['inh'].append((cur['n'],r))
    if not fee: flags['nofee'].append((cur['n'],t,days))

js=open(sys.argv[2],encoding='utf8').read()
new=json.dumps([[d['n'],d['s'],d['x']] for d in docs],ensure_ascii=False,separators=(',',':'))
a=js.index('/*DOCS_START*/');b=js.index('/*DOCS_END*/')
js=js[:a]+'/*DOCS_START*/\n  var DOCS = '+new+';\n  '+js[b:]
if len(sys.argv)>3:
    y,m=map(int,sys.argv[3].split('-'));lab=['January','February','March','April','May','June','July','August','September','October','November','December'][m-1]+' '+str(y)
    js=re.sub(r"var SCH = \{[^}]*\};","var SCH = { y: %d, m: %d, label: '%s' };"%(y,m,lab),js,1)
open(sys.argv[2],'w',encoding='utf8').write(js)
print('Doctors:',len(docs),'| sessions:',sum(len(d['x']) for d in docs),'| specialties:',len(specs))
print('Ambiguous timings (shown as written, flagged):',flags['amb'])
print('Alternate-day entries:',flags['alt'])
print('Doctors not matched to a known specialty heading would have raised an error above.')
